import React, { useState } from 'react';
import { 
  Plus, 
  LogOut, 
  Share2, 
  Trash2, 
  Download, 
  Undo2, 
  Pencil, 
  Eraser, 
  Type, 
  Image as ImageIcon, 
  Users, 
  ChevronRight,
  Heart,
  Menu,
  Lock,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'landing' | 'login' | 'dashboard' | 'join' | 'canvas';

// --- Components ---

const PixelButton = ({ children, onClick, className = "", variant = "default" }: any) => {
  const variantClass = 
    variant === 'primary' ? 'cm-button-primary' : 
    variant === 'blue' ? 'cm-button-blue' : '';
  
  return (
    <button 
      onClick={onClick}
      className={`cm-button ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

const PixelCard = ({ children, className = "" }: any) => (
  <div className={`cm-card ${className}`}>
    {children}
  </div>
);

const PixelInput = ({ value, onChange, placeholder, className = "" }: any) => (
  <input 
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`cm-input ${className}`}
  />
);

// --- Views ---

const LandingView = ({ setView, loginAsGuest }: { setView: (v: View) => void, loginAsGuest: () => void }) => (
  <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
    <nav className="p-6 flex justify-between items-center bg-white border-b-3 border-black">
      <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
        <div className="w-10 h-10 bg-cm-yellow border-3 border-black rounded-xl flex items-center justify-center text-black shadow-[2px_2px_0px_black]">D</div>
        DOODLESHARE
      </div>
      <PixelButton onClick={() => setView('login')}>LOGIN</PixelButton>
    </nav>
    
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-16 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-[10%] w-20 h-20 bg-cm-pink/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-[10%] w-32 h-32 bg-cm-blue/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="max-w-4xl flex flex-col gap-10 z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
          DRAW TOGETHER,<br/>
          <span className="text-cm-blue drop-shadow-[4px_4px_0px_black]">EVERY PIXEL COUNTS.</span>
        </h1>
        <p className="text-xl font-bold opacity-60 max-w-2xl mx-auto leading-relaxed">
          The ultimate collaborative drawing game. 
          Create a room, invite your friends, and start doodling in real-time.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-4">
          <PixelButton onClick={loginAsGuest} className="text-xl py-4 px-10" variant="primary">
            START DRAWING <ChevronRight size={28} />
          </PixelButton>
          <PixelButton onClick={() => setView('join')} className="text-xl py-4 px-10">
            JOIN ROOM
          </PixelButton>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
        {[
          { icon: <Pencil size={24} />, title: "PLAYFUL TOOLS", desc: "Fun and easy-to-use tools designed for creativity.", color: "bg-cm-yellow" },
          { icon: <Users size={24} />, title: "MULTIPLAYER", desc: "Draw with up to 16 friends in the same room.", color: "bg-cm-blue" },
          { icon: <Share2 size={24} />, title: "INSTANT SHARE", desc: "Share your room link and start playing immediately.", color: "bg-cm-green" }
        ].map((feat, i) => (
          <PixelCard key={i} className="flex flex-col items-center gap-6 text-center p-8 hover:translate-y-[-8px] transition-transform cursor-default">
            <div className={`p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_black] ${feat.color}`}>{feat.icon}</div>
            <h3 className="font-black text-xl uppercase tracking-tight">{feat.title}</h3>
            <p className="text-sm font-bold opacity-50 leading-relaxed">{feat.desc}</p>
          </PixelCard>
        ))}
      </div>
    </main>
    
    <footer className="p-8 border-t-3 border-black bg-white text-center font-black text-xs opacity-30 tracking-widest">
      © 2026 DOODLESHARE • MADE WITH JOY
    </footer>
  </div>
);

const LoginView = ({ setView, loginWithGoogle, loginAsGuest }: { setView: (v: View) => void, loginWithGoogle: () => void, loginAsGuest: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
    <PixelCard className="w-full max-w-md flex flex-col gap-10 p-12">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-4xl font-black tracking-tight">WELCOME BACK!</h2>
        <p className="font-bold text-sm opacity-40 uppercase tracking-widest">Choose your way to play</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={loginWithGoogle}
          className="cm-button w-full py-4 flex items-center justify-center gap-4 bg-white"
        >
          <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" referrerPolicy="no-referrer" />
          CONTINUE WITH GOOGLE
        </button>

        <button 
          onClick={loginAsGuest}
          className="cm-button w-full py-4 flex items-center justify-center gap-4 bg-cm-blue text-black"
        >
          CONTINUE AS GUEST
        </button>
      </div>

      <button onClick={() => setView('landing')} className="font-black underline text-xs opacity-30 hover:opacity-100 transition-opacity uppercase tracking-widest">
        GO BACK TO HOME
      </button>
    </PixelCard>
  </div>
);

const DashboardView = ({ setView, user }: { setView: (v: View) => void, user: string | null }) => {
  const [canvases] = useState([
    { id: 1, title: 'Friday Night Doodles', date: '2026-03-19', public: true, color: 'bg-cm-yellow' },
    { id: 2, title: 'Character Concepts', date: '2026-03-15', public: false, color: 'bg-cm-pink' },
    { id: 3, title: 'World Map', date: '2026-03-10', public: true, color: 'bg-cm-blue' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <header className="p-4 bg-white border-b-3 border-black flex justify-between items-center px-8">
        <div className="font-black text-2xl tracking-tighter">DOODLESHARE</div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-3 font-black text-sm">
            <div className={`w-10 h-10 rounded-full border-3 border-black shadow-[2px_2px_0px_black] ${user === 'GUEST_USER' ? 'bg-gray-200' : 'bg-cm-pink'}`}></div>
            <div className="flex flex-col">
              <span className="leading-none">{user === 'GUEST_USER' ? 'GUEST' : user || 'ANONYMOUS'}</span>
              <span className="text-[10px] opacity-40">LEVEL 1</span>
            </div>
          </div>
          <PixelButton onClick={() => setView('landing')} className="p-2 shadow-[2px_2px_0px_black]"><LogOut size={18} /></PixelButton>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">MY ROOMS</h1>
            <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Manage your collaborative drawing spaces</p>
          </div>
          <PixelButton onClick={() => setView('canvas')} variant="primary" className="py-4 px-8 text-lg">
            <Plus size={24} /> CREATE NEW ROOM
          </PixelButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {canvases.map(canvas => (
            <motion.div 
              key={canvas.id}
              whileHover={{ y: -5 }}
              className="group"
            >
              <PixelCard className="p-0 overflow-hidden flex flex-col h-full border-3 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div 
                  className={`h-40 ${canvas.color} border-b-3 border-black flex items-center justify-center cursor-pointer relative overflow-hidden`}
                  onClick={() => setView('canvas')}
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <ImageIcon size={48} className="opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-300" />
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl uppercase truncate max-w-[200px]">{canvas.title}</h3>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">{canvas.date}</p>
                    </div>
                    <div className="p-2 bg-black/5 rounded-lg border-2 border-black/10">
                      {canvas.public ? <Unlock size={16} className="opacity-40" /> : <Lock size={16} className="opacity-40" />}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <PixelButton onClick={() => setView('canvas')} className="flex-1 text-xs py-2 shadow-[2px_2px_0px_black]">ENTER ROOM</PixelButton>
                    <PixelButton className="text-xs py-2 px-3 shadow-[2px_2px_0px_black]"><Share2 size={14} /></PixelButton>
                    <PixelButton className="text-xs py-2 px-3 shadow-[2px_2px_0px_black] text-red-500"><Trash2 size={14} /></PixelButton>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

const JoinView = ({ setView }: { setView: (v: View) => void }) => {
  const [nickname, setNickname] = useState('Happy Slime');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
      <PixelCard className="w-full max-w-md flex flex-col gap-10 p-12 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">JOIN ROOM</h2>
          <div className="px-4 py-1 bg-cm-yellow border-2 border-black rounded-full self-center">
            <p className="text-xs font-black italic">"Friday Night Doodles"</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-left">
          <label className="font-black text-xs uppercase tracking-widest opacity-40 ml-1">YOUR NICKNAME</label>
          <PixelInput 
            value={nickname} 
            onChange={(e: any) => setNickname(e.target.value)}
            className="text-xl font-black py-4"
          />
        </div>

        <PixelButton onClick={() => setView('canvas')} variant="primary" className="py-4 text-xl">
          JOIN NOW
        </PixelButton>

        <button onClick={() => setView('landing')} className="font-black opacity-30 hover:opacity-100 underline text-xs transition-opacity uppercase tracking-widest">
          CANCEL
        </button>
      </PixelCard>
    </div>
  );
};

const CanvasView = ({ setView, user }: { setView: (v) => void, user: string | null }) => {
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isPublic, setIsPublic] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#ff914d', 
    '#ffde59', '#7ed957', '#5ce1e6', '#4a90e2',
    '#cb6ce6', '#ff66c4', '#804000', '#808080'
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f0f4f8] font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b-3 border-black flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="cm-button p-2 shadow-[2px_2px_0px_black]">
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <input 
              defaultValue="Friday Night Doodles" 
              className="bg-transparent font-black uppercase text-lg outline-none border-b-2 border-transparent focus:border-black"
            />
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40">
              <Users size={10} /> 4 PLAYERS • {isPublic ? 'PUBLIC ROOM' : 'PRIVATE ROOM'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 mr-4">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-cm-yellow flex items-center justify-center text-xs font-black">
                  {['A', 'B', 'C'][i-1]}
                </div>
              ))}
            </div>
            <span className="text-xs font-black opacity-40">+12 OTHERS</span>
          </div>
          <PixelButton className="p-2 shadow-[2px_2px_0px_black]" onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? <Unlock size={18} /> : <Lock size={18} />}
          </PixelButton>
          <PixelButton className="p-2 shadow-[2px_2px_0px_black]" variant="blue"><Share2 size={18} /></PixelButton>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden p-4 gap-4">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col gap-4 relative">
          <main className="flex-1 cm-panel bg-white flex items-center justify-center overflow-auto relative canvas-cursor shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
            <div className="bg-white min-w-[800px] min-h-[600px] relative">
              {/* Simulated Drawing Content */}
              <div className="absolute top-20 left-40 w-32 h-32 border-3 border-black rounded-3xl flex items-center justify-center text-3xl bg-cm-pink/10">
                <Heart size={60} fill="#ff66c4" color="#000" strokeWidth={3} />
              </div>
              <div className="absolute top-60 left-80 font-black text-4xl rotate-2 text-cm-blue drop-shadow-[2px_2px_0px_black]">
                CATCH MIND!
              </div>
              
              {/* Simulated Cursors */}
              <div className="absolute top-1/2 left-1/3 flex flex-col items-start gap-1 pointer-events-none">
                <div className="w-4 h-4 bg-cm-blue border-2 border-black rounded-full"></div>
                <div className="bg-black text-white text-[10px] px-2 py-0.5 font-black rounded-full">COOL_CAT</div>
              </div>

              <div className="absolute top-1/4 left-2/3 flex flex-col items-start gap-1 pointer-events-none">
                <div className="w-4 h-4 bg-cm-pink border-2 border-black rounded-full"></div>
                <div className="bg-black text-white text-[10px] px-2 py-0.5 font-black rounded-full">ARTIST_99</div>
              </div>
            </div>
          </main>

          {/* Figma-style Floating Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div className="cm-toolbar flex items-center gap-2">
              <div className="flex items-center gap-1.5 pr-4 border-r-2 border-black/10">
                {[
                  { id: 'pencil', icon: <Pencil size={20} />, color: 'bg-cm-yellow' },
                  { id: 'eraser', icon: <Eraser size={20} />, color: 'bg-cm-blue' },
                  { id: 'text', icon: <Type size={20} />, color: 'bg-cm-green' },
                  { id: 'image', icon: <ImageIcon size={20} />, color: 'bg-cm-pink' },
                ].map(tool => (
                  <button 
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black transition-all ${selectedTool === tool.id ? tool.color + ' shadow-[2px_2px_0px_black] -translate-y-1' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 px-2">
                {colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 border-black transition-transform hover:scale-110 ${selectedColor === color ? 'scale-125 z-10' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 pl-4 border-l-2 border-black/10">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-gray-50">
                  <Undo2 size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-black bg-cm-orange text-black shadow-[2px_2px_0px_black]">
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Players & Chat) */}
        <aside className="hidden md:flex w-72 flex-col gap-4">
          {/* Players List */}
          <div className="flex-1 cm-panel flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
            <div className="p-4 bg-cm-yellow border-b-3 border-black font-black text-sm flex justify-between items-center">
              <span>PLAYERS (16)</span>
              <Users size={16} />
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {[
                { name: 'COOL_CAT', score: 120, color: 'bg-cm-blue' },
                { name: 'ARTIST_99', score: 85, color: 'bg-cm-pink' },
                { name: 'PIXEL_KING', score: 45, color: 'bg-cm-green' },
                { name: 'YOU', score: 0, color: 'bg-cm-yellow', isMe: true },
              ].map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-xl border-2 border-black ${p.isMe ? 'bg-white' : 'bg-black/5'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-2 border-black ${p.color}`}></div>
                    <span className="font-black text-xs">{p.name}</span>
                  </div>
                  <span className="font-black text-xs text-cm-orange">{p.score}P</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Box */}
          <div className="h-64 cm-panel flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
            <div className="p-3 bg-cm-blue border-b-3 border-black font-black text-xs">CHAT</div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 text-[10px] font-bold">
              <div className="text-black/40 italic">COOL_CAT joined the room</div>
              <div><span className="text-cm-pink">ARTIST_99:</span> Wow, nice drawing!</div>
              <div><span className="text-cm-blue">COOL_CAT:</span> Thanks!</div>
              <div className="text-cm-orange">SYSTEM: Round 1 starts in 5s...</div>
            </div>
            <div className="p-2 border-t-3 border-black bg-white">
              <input 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-transparent outline-none font-bold text-xs"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<string | null>(null);

  const loginAsGuest = () => {
    setUser('GUEST_USER');
    setView('dashboard');
  };

  const loginWithGoogle = () => {
    setUser('ANGRYBIRD');
    setView('dashboard');
  };

  // Simple routing simulation
  return (
    <div className="selection:bg-retro-blue selection:text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "linear" }}
        >
          {view === 'landing' && <LandingView setView={setView} loginAsGuest={loginAsGuest} />}
          {view === 'login' && <LoginView setView={setView} loginWithGoogle={loginWithGoogle} loginAsGuest={loginAsGuest} />}
          {view === 'dashboard' && <DashboardView setView={setView} user={user} />}
          {view === 'join' && <JoinView setView={setView} />}
          {view === 'canvas' && <CanvasView setView={setView} user={user} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
