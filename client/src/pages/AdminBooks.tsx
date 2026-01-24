import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookMarked, Loader2, ChevronLeft, Users, Heart, GitBranch,
  DollarSign, Plus, Edit, Save, X, ChevronDown, ChevronUp
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminBooks() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'characters' | 'relationships' | 'storylines' | 'pricing'>('characters');
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [showAddStoryline, setShowAddStoryline] = useState(false);
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  const { data: books } = trpc.books.list.useQuery({});
  const { data: characters, refetch: refetchCharacters } = trpc.admin.getBookCharacters.useQuery(
    { bookId: selectedBookId || undefined },
    { enabled: !!selectedBookId }
  );
  const { data: relationships, refetch: refetchRelationships } = trpc.admin.getCharacterRelationships.useQuery(
    { bookId: selectedBookId || undefined },
    { enabled: !!selectedBookId }
  );
  const { data: storylines, refetch: refetchStorylines } = trpc.admin.getBookStorylines.useQuery(
    { bookId: selectedBookId || undefined },
    { enabled: !!selectedBookId }
  );
  const { data: pricingHistory, refetch: refetchPricing } = trpc.admin.getBookPricingHistory.useQuery(
    { bookId: selectedBookId! },
    { enabled: !!selectedBookId }
  );

  const [newCharacter, setNewCharacter] = useState({
    fullName: '', nickname: '', role: 'protagonist' as const, description: '',
    physicalDescription: '', personality: '', occupation: '', age: ''
  });

  const [newStoryline, setNewStoryline] = useState({
    title: '', storylineType: 'main_plot' as const, description: '', resolution: ''
  });

  const createCharacterMutation = trpc.admin.createBookCharacter.useMutation({
    onSuccess: () => {
      toast.success("Character added");
      setShowAddCharacter(false);
      setNewCharacter({ fullName: '', nickname: '', role: 'protagonist', description: '', physicalDescription: '', personality: '', occupation: '', age: '' });
      refetchCharacters();
    },
    onError: (error) => toast.error(error.message),
  });

  const createStorylineMutation = trpc.admin.createBookStoryline.useMutation({
    onSuccess: () => {
      toast.success("Storyline added");
      setShowAddStoryline(false);
      setNewStoryline({ title: '', storylineType: 'main_plot', description: '', resolution: '' });
      refetchStorylines();
    },
    onError: (error) => toast.error(error.message),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'protagonist': return 'bg-blue-500/20 text-blue-400';
      case 'love_interest': return 'bg-pink-500/20 text-pink-400';
      case 'antagonist': return 'bg-red-500/20 text-red-400';
      case 'supporting': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStorylineColor = (type: string) => {
    switch (type) {
      case 'main_plot': return 'bg-amber-500/20 text-amber-400';
      case 'romance_arc': return 'bg-pink-500/20 text-pink-400';
      case 'subplot': return 'bg-blue-500/20 text-blue-400';
      case 'character_arc': return 'bg-purple-500/20 text-purple-400';
      case 'mystery': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  Book Management
                </h1>
                <p className="text-gray-400 text-lg">
                  Manage characters, relationships, storylines, and pricing
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Book List Sidebar */}
              <div className="lg:col-span-1">
                <h3 className="font-semibold text-white mb-4">Select a Book</h3>
                <div className="space-y-2">
                  {books?.map((book) => (
                    <Card
                      key={book.id}
                      onClick={() => setSelectedBookId(book.id)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedBookId === book.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37]/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{book.title}</p>
                          <p className="text-gray-500 text-xs">{book.series}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {selectedBookId ? (
                  <>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {[
                        { id: 'characters', label: 'Characters', icon: Users },
                        { id: 'relationships', label: 'Relationships', icon: Heart },
                        { id: 'storylines', label: 'Storylines', icon: GitBranch },
                        { id: 'pricing', label: 'Pricing', icon: DollarSign },
                      ].map((tab) => (
                        <Button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          variant={activeTab === tab.id ? 'default' : 'outline'}
                          className={activeTab === tab.id 
                            ? 'bg-[#d4af37] text-black' 
                            : 'border-white/20 text-white hover:bg-white/10'
                          }
                        >
                          <tab.icon className="h-4 w-4 mr-2" />
                          {tab.label}
                        </Button>
                      ))}
                    </div>

                    {/* Characters Tab */}
                    {activeTab === 'characters' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-white">Characters</h3>
                          <Button
                            onClick={() => setShowAddCharacter(true)}
                            size="sm"
                            className="bg-[#d4af37] text-black"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Character
                          </Button>
                        </div>

                        {showAddCharacter && (
                          <Card className="p-4 bg-white/5 border-white/10 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                placeholder="Full Name"
                                value={newCharacter.fullName}
                                onChange={(e) => setNewCharacter({ ...newCharacter, fullName: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <Input
                                placeholder="Nickname"
                                value={newCharacter.nickname}
                                onChange={(e) => setNewCharacter({ ...newCharacter, nickname: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <select
                                value={newCharacter.role}
                                onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value as any })}
                                className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                              >
                                <option value="protagonist">Protagonist</option>
                                <option value="love_interest">Love Interest</option>
                                <option value="antagonist">Antagonist</option>
                                <option value="supporting">Supporting</option>
                                <option value="minor">Minor</option>
                              </select>
                              <Input
                                placeholder="Occupation"
                                value={newCharacter.occupation}
                                onChange={(e) => setNewCharacter({ ...newCharacter, occupation: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <Textarea
                                placeholder="Description"
                                value={newCharacter.description}
                                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                                className="bg-white/5 border-white/10 text-white col-span-2"
                              />
                              <Textarea
                                placeholder="Physical Description"
                                value={newCharacter.physicalDescription}
                                onChange={(e) => setNewCharacter({ ...newCharacter, physicalDescription: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <Textarea
                                placeholder="Personality"
                                value={newCharacter.personality}
                                onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={() => createCharacterMutation.mutate({ ...newCharacter, bookId: selectedBookId })}
                                disabled={!newCharacter.fullName || createCharacterMutation.isPending}
                                className="bg-[#d4af37] text-black"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button onClick={() => setShowAddCharacter(false)} variant="ghost" className="text-gray-400">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </Card>
                        )}

                        <div className="space-y-3">
                          {characters?.map((char) => (
                            <Card key={char.id} className="p-4 bg-white/5 border-white/10">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-white font-semibold">{char.fullName}</h4>
                                    {char.nickname && <span className="text-gray-500">({char.nickname})</span>}
                                    <Badge className={getRoleColor(char.role)}>{char.role.replace('_', ' ')}</Badge>
                                  </div>
                                  {char.occupation && <p className="text-sm text-[#d4af37]">{char.occupation}</p>}
                                  {char.description && <p className="text-sm text-gray-400 mt-2">{char.description}</p>}
                                </div>
                              </div>
                            </Card>
                          ))}
                          {(!characters || characters.length === 0) && (
                            <Card className="p-8 bg-white/5 border-white/10 text-center">
                              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">No characters added yet</p>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Relationships Tab */}
                    {activeTab === 'relationships' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Character Relationships</h3>
                        <div className="space-y-3">
                          {relationships?.map((rel) => {
                            const char1 = characters?.find(c => c.id === rel.character1Id);
                            const char2 = characters?.find(c => c.id === rel.character2Id);
                            return (
                              <Card key={rel.id} className="p-4 bg-white/5 border-white/10">
                                <div className="flex items-center gap-4">
                                  <span className="text-white font-medium">{char1?.fullName || 'Unknown'}</span>
                                  <Badge className="bg-pink-500/20 text-pink-400">{rel.relationshipType}</Badge>
                                  <span className="text-white font-medium">{char2?.fullName || 'Unknown'}</span>
                                </div>
                                {rel.description && <p className="text-sm text-gray-400 mt-2">{rel.description}</p>}
                              </Card>
                            );
                          })}
                          {(!relationships || relationships.length === 0) && (
                            <Card className="p-8 bg-white/5 border-white/10 text-center">
                              <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">No relationships defined yet</p>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Storylines Tab */}
                    {activeTab === 'storylines' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-white">Storylines</h3>
                          <Button
                            onClick={() => setShowAddStoryline(true)}
                            size="sm"
                            className="bg-[#d4af37] text-black"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Storyline
                          </Button>
                        </div>

                        {showAddStoryline && (
                          <Card className="p-4 bg-white/5 border-white/10 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                placeholder="Title"
                                value={newStoryline.title}
                                onChange={(e) => setNewStoryline({ ...newStoryline, title: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <select
                                value={newStoryline.storylineType}
                                onChange={(e) => setNewStoryline({ ...newStoryline, storylineType: e.target.value as any })}
                                className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                              >
                                <option value="main_plot">Main Plot</option>
                                <option value="subplot">Subplot</option>
                                <option value="romance_arc">Romance Arc</option>
                                <option value="character_arc">Character Arc</option>
                                <option value="mystery">Mystery</option>
                              </select>
                              <Textarea
                                placeholder="Description"
                                value={newStoryline.description}
                                onChange={(e) => setNewStoryline({ ...newStoryline, description: e.target.value })}
                                className="bg-white/5 border-white/10 text-white col-span-2"
                              />
                              <Textarea
                                placeholder="Resolution"
                                value={newStoryline.resolution}
                                onChange={(e) => setNewStoryline({ ...newStoryline, resolution: e.target.value })}
                                className="bg-white/5 border-white/10 text-white col-span-2"
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={() => createStorylineMutation.mutate({ ...newStoryline, bookId: selectedBookId })}
                                disabled={!newStoryline.title || !newStoryline.description || createStorylineMutation.isPending}
                                className="bg-[#d4af37] text-black"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button onClick={() => setShowAddStoryline(false)} variant="ghost" className="text-gray-400">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </Card>
                        )}

                        <div className="space-y-3">
                          {storylines?.map((story) => (
                            <Card key={story.id} className="p-4 bg-white/5 border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-white font-semibold">{story.title}</h4>
                                <Badge className={getStorylineColor(story.storylineType)}>
                                  {story.storylineType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">{story.description}</p>
                              {story.resolution && (
                                <p className="text-sm text-emerald-400 mt-2">
                                  <strong>Resolution:</strong> {story.resolution}
                                </p>
                              )}
                            </Card>
                          ))}
                          {(!storylines || storylines.length === 0) && (
                            <Card className="p-8 bg-white/5 border-white/10 text-center">
                              <GitBranch className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">No storylines added yet</p>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Pricing History</h3>
                        <div className="space-y-3">
                          {pricingHistory?.map((record) => (
                            <Card key={record.id} className="p-4 bg-white/5 border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Badge className="bg-[#d4af37]/20 text-[#d4af37] capitalize">{record.platform.replace('_', ' ')}</Badge>
                                  <span className="text-2xl font-bold text-white">{record.price}</span>
                                  {record.previousPrice && (
                                    <span className="text-sm text-gray-500 line-through">{record.previousPrice}</span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">
                                  Verified: {new Date(record.verifiedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </Card>
                          ))}
                          {(!pricingHistory || pricingHistory.length === 0) && (
                            <Card className="p-8 bg-white/5 border-white/10 text-center">
                              <DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">No pricing records yet</p>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Card className="p-12 bg-white/5 border-white/10 text-center">
                    <BookMarked className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select a Book</h3>
                    <p className="text-gray-400">Choose a book from the sidebar to manage its characters, storylines, and pricing.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
