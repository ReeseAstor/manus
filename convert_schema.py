#!/usr/bin/env python3
import re

# Read the MySQL schema
with open('drizzle/schema.ts', 'r') as f:
    lines = f.readlines()

content = ''.join(lines)

# Track all enum definitions
enum_definitions = []
enum_map = {}

# Step 1: Extract and build enum definitions
# Pattern: mysqlEnum("name", ["val1", "val2", ...])
pattern = r'mysqlEnum\("([^"]+)",\s*\[([^\]]+)\]\)'

for match in re.finditer(pattern, content):
    enum_name = match.group(1)
    enum_values = match.group(2)
    
    if enum_name not in enum_map:
        enum_var_name = f"{enum_name}Enum"
        enum_def = f'export const {enum_var_name} = pgEnum("{enum_name}", [{enum_values}]);'
        enum_definitions.append(enum_def)
        enum_map[enum_name] = enum_var_name

# Step 2: Replace imports
content = content.replace(
    'import { int, mysqlTable, text, timestamp, varchar, mysqlEnum, boolean, json, decimal } from "drizzle-orm/mysql-core";',
    'import { pgEnum, int, pgTable, text, timestamp, varchar, boolean, json, serial, numeric } from "drizzle-orm/pg-core";'
)

# Step 3: Replace all mysqlTable with pgTable
content = content.replace('mysqlTable(', 'pgTable(')

# Step 4: Replace all mysqlEnum calls with enum references
for enum_name, enum_var in enum_map.items():
    pattern = f'mysqlEnum\\("{enum_name}",\\s*\\[[^\\]]+\\]\\)'
    content = re.sub(pattern, enum_var, content)

# Step 5: Replace autoincrement with serial
# Pattern: id: int("id").autoincrement().primaryKey()
content = re.sub(
    r'int\("id"\)\.autoincrement\(\)\.primaryKey\(\)',
    'serial("id").primaryKey()',
    content
)

# Step 6: Remove .onUpdateNow()
content = content.replace('.onUpdateNow()', '')

# Step 7: Replace decimal with numeric
content = content.replace(' decimal(', ' numeric(')

# Step 8: Insert enum definitions after imports
import_end = content.find('/**\n * Core user table')
if import_end == -1:
    # Find the first export const
    import_end = content.find('export const')
    
enum_block = '\n\n' + '\n'.join(enum_definitions) + '\n\n'
content = content[:import_end] + enum_block + content[import_end:]

# Write the converted schema
with open('drizzle/schema.ts', 'w') as f:
    f.write(content)

print(f"✓ Schema converted to PostgreSQL")
print(f"✓ {len(enum_map)} enum types defined")
print(f"✓ Removed all autoincrement(), .onUpdateNow()")
print(f"✓ Replaced decimal() with numeric()")
