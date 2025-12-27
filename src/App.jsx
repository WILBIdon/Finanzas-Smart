import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Wallet, TrendingUp, TrendingDown, Target, Brain, Check,
    AlertTriangle, Calendar, ChevronDown, Trophy, PiggyBank, PlusCircle,
    Pencil, Save, X, Rocket, Percent, Cloud, LogOut, RefreshCw, Zap
} from 'lucide-react';

// --- MODAL DE CIERRE DE MES ---
const ModalCierreMes = ({ plantillas, onProcesar, onCerrar, formatCurrency }) => {
    const [items, setItems] = useState(plantillas);

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: field === 'valor' ? parseInt(value) || 0 : value };
        setItems(updated);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                    <div className="flex items-center gap-3">
                        <Zap size={28} className="animate-pulse" />
                        <div>
                            <h2 className="text-xl font-black">¡Nuevo Mes!</h2>
                            <p className="text-sm opacity-80">Confirma tus ingresos y gastos fijos</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
                    {items.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No tienes items recurrentes configurados</p>
                    ) : items.map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border-2 ${item.tipo === 'ingreso' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${item.tipo === 'ingreso' ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
                                    {item.tipo === 'ingreso' ? 'Ingreso' : 'Gasto Fijo'}
                                </span>
                            </div>
                            <input className="w-full bg-white rounded-lg px-3 py-2 font-bold text-gray-700 mb-2" value={item.concepto} onChange={(e) => updateItem(i, 'concepto', e.target.value)} />
                            <input type="number" className="w-full bg-white rounded-lg px-3 py-2 font-black text-lg" value={item.valor} onChange={(e) => updateItem(i, 'valor', e.target.value)} />
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-gray-50 flex gap-3">
                    <button onClick={onCerrar} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-200">Ahora No</button>
                    <button onClick={() => onProcesar(items)} className="flex-1 py-3 rounded-xl font-black text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                        Procesar Mes
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE ListSection CON CHECKBOX RECURRENTE ---
const ListSection = ({ title, items, setter, color, bgColor, icon: Icon, placeholder, type = 'normal', periodo, totalAhorrado, editingId, setEditingId, newItem, setNewItem, formatCurrency, onDataChange, showRecurrente = false }) => {
    const [esRecurrente, setEsRecurrente] = useState(false);

    const handleSaveItem = () => {
        if (!newItem.concepto || !newItem.valor) return;
        let updatedList;
        if (editingId) {
            updatedList = items.map(item => item.id === editingId ? { ...item, concepto: newItem.concepto, valor: type === 'meta' ? item.valor : parseInt(newItem.valor), meta: type === 'meta' ? parseInt(newItem.valor) : undefined, rendimiento: type === 'inversion' ? parseFloat(newItem.rendimiento || 0) : undefined, esRecurrente: showRecurrente ? esRecurrente : item.esRecurrente } : item);
            setEditingId(null);
        } else {
            const baseItem = { id: Date.now(), concepto: newItem.concepto, esRecurrente: showRecurrente ? esRecurrente : false };
            if (type === 'meta') updatedList = [...items, { ...baseItem, meta: parseInt(newItem.valor), ahorrado: 0 }];
            else if (type === 'inversion') updatedList = [...items, { ...baseItem, valor: parseInt(newItem.valor), rendimiento: parseFloat(newItem.rendimiento || 0) }];
            else updatedList = [...items, { ...baseItem, valor: parseInt(newItem.valor) }];
        }
        setter(updatedList);
        setNewItem({ concepto: '', valor: '', rendimiento: '' });
        setEsRecurrente(false);
        if (onDataChange) onDataChange();
    };

    const cancelEdit = () => { setEditingId(null); setNewItem({ concepto: '', valor: '', rendimiento: '' }); setEsRecurrente(false); };
    const deleteItem = (id) => { if (editingId === id) cancelEdit(); setter(items.filter(i => i.id !== id)); if (onDataChange) onDataChange(); };
    const startEdit = (item) => { setEditingId(item.id); setNewItem({ concepto: item.concepto, valor: type === 'meta' ? item.meta : item.valor, rendimiento: type === 'inversion' ? item.rendimiento : '' }); setEsRecurrente(item.esRecurrente || false); };
    const abonarMeta = (id, valorAbono) => { if (!valorAbono || isNaN(valorAbono)) return; setter(items.map(m => m.id === id ? { ...m, ahorrado: m.ahorrado + parseInt(valorAbono) } : m)); if (onDataChange) onDataChange(); };
    const toggleRecurrente = (id) => { setter(items.map(i => i.id === id ? { ...i, esRecurrente: !i.esRecurrente } : i)); if (onDataChange) onDataChange(); };

    return (
        <div className="pb-4 animate-in fade-in zoom-in duration-300">
            <div className={`p-4 sm:p-6 rounded-b-3xl shadow-sm mb-6 ${bgColor}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 sm:p-3 rounded-full bg-white/60 ${color}`}><Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} /></div>
                    <div>
                        <h2 className={`text-xl sm:text-2xl font-black ${color} leading-none`}>{title}</h2>
                        <span className={`text-xs sm:text-sm font-bold opacity-70 uppercase tracking-wide ${color}`}>{type === 'meta' || type === 'inversion' ? 'Patrimonio' : periodo}</span>
                    </div>
                </div>
                <div className="text-right mt-2">
                    {type === 'meta' ? <><span className="text-xs font-bold uppercase opacity-60">Total Ahorrado</span><p className={`text-2xl sm:text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(totalAhorrado)}</p></> : <p className={`text-2xl sm:text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(items.reduce((acc, i) => acc + (i.valor || 0), 0))}</p>}
                </div>
            </div>

            <div className="px-3 sm:px-4">
                <div className={`bg-white p-3 rounded-2xl shadow-md border-2 transition-colors flex flex-col gap-3 mb-6 ${editingId ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100'}`}>
                    {editingId && <div className="flex justify-between items-center px-1"><span className="text-xs font-bold text-yellow-600 uppercase">Modo Edición</span><button onClick={cancelEdit} className="text-gray-400"><X size={16} /></button></div>}
                    <input type="text" placeholder={placeholder || "Concepto..."} className={`w-full rounded-xl px-3 py-3 text-base outline-none focus:ring-2 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`} value={newItem.concepto} onChange={(e) => setNewItem({ ...newItem, concepto: e.target.value })} />
                    <div className="flex gap-2">
                        <input type="number" placeholder={type === 'meta' ? "Meta Total ($)" : "$0"} className={`flex-1 rounded-xl px-3 py-3 text-lg font-bold outline-none focus:ring-2 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`} value={newItem.valor} onChange={(e) => setNewItem({ ...newItem, valor: e.target.value })} />
                        {type === 'inversion' && <input type="number" placeholder="%" className="w-20 rounded-xl px-2 py-3 text-center font-bold bg-gray-50 focus:ring-2" value={newItem.rendimiento} onChange={(e) => setNewItem({ ...newItem, rendimiento: e.target.value })} />}
                        <button onClick={handleSaveItem} className={`px-5 rounded-xl text-white shadow-lg ${editingId ? 'bg-yellow-500' : color.includes('green') ? 'bg-green-600' : color.includes('red') ? 'bg-red-600' : color.includes('cyan') ? 'bg-cyan-600' : color.includes('indigo') ? 'bg-indigo-600' : color.includes('orange') ? 'bg-orange-600' : 'bg-purple-600'}`}>
                            {editingId ? <Save size={24} /> : <Plus size={24} strokeWidth={3} />}
                        </button>
                    </div>
                    {showRecurrente && (
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                            <input type="checkbox" checked={esRecurrente} onChange={(e) => setEsRecurrente(e.target.checked)} className="w-5 h-5 rounded accent-blue-600" />
                            <RefreshCw size={14} /> Es recurrente (se repite cada mes)
                        </label>
                    )}
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className={`bg-white p-3 rounded-2xl shadow-sm border relative ${editingId === item.id ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-100'}`}>
                            {type === 'meta' ? (
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div><span className="font-bold text-gray-800 text-lg block">{item.concepto}</span><span className="text-xs text-gray-400">Meta: {formatCurrency(item.meta)}</span></div>
                                        <div className="flex gap-1"><button onClick={() => startEdit(item)} className="text-blue-400 p-2 bg-blue-50 rounded-lg"><Pencil size={16} /></button><button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button></div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden"><div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${Math.min((item.ahorrado / item.meta) * 100, 100)}%` }}></div></div>
                                    <div className="flex justify-between items-end"><span className="text-xl font-black text-cyan-600">{formatCurrency(item.ahorrado)}</span><button onClick={() => { const abono = prompt(`Abonar a: ${item.concepto}`); if (abono) abonarMeta(item.id, abono); }} className="bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1"><PlusCircle size={16} /> Abonar</button></div>
                                </div>
                            ) : type === 'inversion' ? (
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div><span className="font-bold text-gray-800">{item.concepto}</span><span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2">Esp: {item.rendimiento}%</span></div>
                                        <div className="flex gap-1"><button onClick={() => startEdit(item)} className="text-blue-400 p-2 bg-blue-50 rounded-lg"><Pencil size={16} /></button><button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button></div>
                                    </div>
                                    <div className="mt-2 flex justify-between border-t pt-2"><div><span className="text-xs text-gray-400 block">Invertido</span><span className="text-xl font-black text-indigo-600">{formatCurrency(item.valor)}</span></div><div className="text-right"><span className="text-xs text-gray-400 block">Proyectado</span><span className="text-lg font-bold text-green-600">{formatCurrency(item.valor + (item.valor * (item.rendimiento / 100)))}</span></div></div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {showRecurrente && <button onClick={() => toggleRecurrente(item.id)} className={`p-1.5 rounded-lg ${item.esRecurrente ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`} title={item.esRecurrente ? 'Recurrente' : 'Único'}><RefreshCw size={14} /></button>}
                                        <div><span className="font-bold text-gray-800">{item.concepto}</span><span className="text-xs text-gray-400 block">{item.esRecurrente ? '🔄 Recurrente' : 'Único'}</span></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-gray-700 text-lg">{formatCurrency(item.valor)}</span>
                                        <button onClick={() => startEdit(item)} className="text-blue-400 p-2 bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                                        <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {items.length === 0 && <div className="text-center text-gray-400 py-10 opacity-50"><Icon size={40} className="mx-auto mb-2" /><p>Sin registros</p></div>}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE SmartTotals ---
const SmartTotals = ({ periodo, bolsa, totalIngresos, totalGastos, totalPatrimonio, obligacionesPendientes, situacionReal, formatCurrency }) => (
    <div className="p-3 pb-4 space-y-4 animate-in slide-in-from-bottom">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-5 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 opacity-90"><div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full"><Wallet size={16} /><span className="font-bold text-xs uppercase">Liquidez</span></div><span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">{periodo}</span></div>
            <div className="text-4xl font-black mb-4">{formatCurrency(bolsa)}</div>
            <div className="flex gap-2 border-t border-white/10 pt-3 text-xs"><div className="flex-1 bg-blue-900/20 p-2 rounded-xl text-center"><span className="block opacity-70 mb-1">Ingresos</span><span className="font-bold text-green-300">{formatCurrency(totalIngresos)}</span></div><div className="flex-1 bg-blue-900/20 p-2 rounded-xl text-center"><span className="block opacity-70 mb-1">Gastos</span><span className="font-bold text-red-300">-{formatCurrency(totalGastos)}</span></div></div>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border-2 border-gray-100">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b"><div className="text-indigo-600 bg-indigo-50 p-2 rounded-2xl"><Brain size={24} /></div><div><h3 className="text-lg font-black text-gray-800">Diagnóstico</h3><span className="text-sm text-gray-400">Salud Financiera</span></div></div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl"><div className="flex items-center gap-2"><Wallet size={14} className="text-gray-400" /><span className="text-gray-500">Liquidez:</span></div><span className="font-black text-blue-600">{formatCurrency(bolsa)}</span></div>
                <div className="flex justify-between items-center p-2 bg-cyan-50 rounded-xl border border-cyan-100"><div className="flex items-center gap-2"><PiggyBank size={14} className="text-cyan-500" /><span className="text-cyan-700 font-bold">Patrimonio:</span></div><span className="font-black text-cyan-600">{formatCurrency(totalPatrimonio)}</span></div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-xl"><div className="flex items-center gap-2"><Target size={14} className="text-orange-400" /><span className="text-gray-500">Por pagar:</span></div><span className="font-black text-orange-600">-{formatCurrency(obligacionesPendientes)}</span></div>
            </div>
            <div className={`mt-4 p-4 rounded-2xl border-2 flex gap-3 items-center ${situacionReal >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`p-2 rounded-full ${situacionReal >= 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>{situacionReal >= 0 ? <Check size={24} strokeWidth={3} /> : <AlertTriangle size={24} />}</div>
                <div><h4 className={`font-black ${situacionReal >= 0 ? 'text-green-800' : 'text-red-800'}`}>{situacionReal >= 0 ? "¡Excelente!" : "¡Falta Liquidez!"}</h4><p className={`text-sm ${situacionReal >= 0 ? 'text-green-700' : 'text-red-700'}`}>{situacionReal >= 0 ? `${formatCurrency(situacionReal)} libres` : `Faltan ${formatCurrency(Math.abs(situacionReal))}`}</p></div>
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function App() {
    const [usuario, setUsuario] = useState(localStorage.getItem('finanzas_usuario') || '');
    const [inputUsuario, setInputUsuario] = useState('');
    const [cargando, setCargando] = useState(false);
    const [activeTab, setActiveTab] = useState('resumen');
    const [periodo, setPeriodo] = useState('Mensual');
    const [editingId, setEditingId] = useState(null);
    const [ingresos, setIngresos] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    const [proyectado, setProyectado] = useState([]);
    const [metas, setMetas] = useState([]);
    const [inversiones, setInversiones] = useState([]);
    const [newItem, setNewItem] = useState({ concepto: '', valor: '', rendimiento: '' });
    const [ultimaFechaCorte, setUltimaFechaCorte] = useState(null);
    const [mostrarModalMes, setMostrarModalMes] = useState(false);
    const [plantillasParaProcesar, setPlantillasParaProcesar] = useState([]);

    // Verificar si es momento de cierre de mes
    const verificarCierreMes = (fechaCorte) => {
        const hoy = new Date();
        if (!fechaCorte) return true; // Primera vez
        const ultima = new Date(fechaCorte);
        const diffDias = Math.floor((hoy - ultima) / (1000 * 60 * 60 * 24));
        return diffDias >= 28; // Aprox 1 mes
    };

    useEffect(() => {
        if (usuario) {
            setCargando(true);
            fetch(`/api/load/${usuario}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setIngresos(data.ingresos || []);
                        setGastos(data.gastos || []);
                        setPresupuesto(data.presupuesto || []);
                        setProyectado(data.proyectado || []);
                        setMetas(data.metas || []);
                        setInversiones(data.inversiones || []);
                        setPeriodo(data.periodo || 'Mensual');
                        setUltimaFechaCorte(data.ultimaFechaCorte || null);

                        // Verificar cierre de mes
                        if (verificarCierreMes(data.ultimaFechaCorte)) {
                            const ingresosRec = (data.ingresos || []).filter(i => i.esRecurrente).map(i => ({ ...i, tipo: 'ingreso' }));
                            const gastosRec = (data.presupuesto || []).filter(i => i.esRecurrente).map(i => ({ ...i, tipo: 'gasto' }));
                            if (ingresosRec.length > 0 || gastosRec.length > 0) {
                                setPlantillasParaProcesar([...ingresosRec, ...gastosRec]);
                                setMostrarModalMes(true);
                            }
                        }
                    } else {
                        setIngresos([{ id: 1, concepto: 'Nómina', valor: 2500000, esRecurrente: true }]);
                        setPresupuesto([{ id: 1, concepto: 'Arriendo', valor: 800000, esRecurrente: true }]);
                    }
                })
                .catch(err => console.error("Error cargando", err))
                .finally(() => setCargando(false));
        }
    }, [usuario]);

    const guardarEnNube = () => {
        if (!usuario) return;
        fetch(`/api/save/${usuario}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingresos, gastos, presupuesto, proyectado, metas, inversiones, periodo, ultimaFechaCorte })
        }).then(res => res.json()).then(r => console.log(r.message)).catch(err => console.error(err));
    };

    useEffect(() => {
        if (usuario && !cargando) {
            const t = setTimeout(guardarEnNube, 1000);
            return () => clearTimeout(t);
        }
    }, [ingresos, gastos, presupuesto, proyectado, metas, inversiones, periodo, ultimaFechaCorte]);

    const procesarMes = (itemsEditados) => {
        const nuevosIngresos = itemsEditados.filter(i => i.tipo === 'ingreso').map(i => ({ id: Date.now() + Math.random(), concepto: i.concepto, valor: i.valor, esRecurrente: true }));
        const nuevosGastos = itemsEditados.filter(i => i.tipo === 'gasto').map(i => ({ id: Date.now() + Math.random(), concepto: i.concepto, valor: i.valor, esRecurrente: true }));

        setIngresos(prev => [...prev.filter(i => !i.esRecurrente), ...nuevosIngresos]);
        setPresupuesto(prev => [...prev.filter(i => !i.esRecurrente), ...nuevosGastos]);
        setUltimaFechaCorte(new Date().toISOString());
        setMostrarModalMes(false);
    };

    const handleLogout = () => { setUsuario(''); localStorage.removeItem('finanzas_usuario'); };

    const totalIngresos = ingresos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const totalPresupuesto = presupuesto.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const totalProyectado = proyectado.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const totalAhorrado = metas.reduce((acc, curr) => acc + (curr.ahorrado || 0), 0);
    const totalInvertido = inversiones.reduce((acc, curr) => acc + (curr.valor || 0), 0);
    const totalPatrimonio = totalAhorrado + totalInvertido;
    const bolsa = totalIngresos - totalGastos - totalPatrimonio;
    const obligacionesPendientes = totalPresupuesto + totalProyectado;
    const situacionReal = bolsa - obligacionesPendientes;

    const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
    const listSectionProps = { periodo, totalAhorrado, editingId, setEditingId, newItem, setNewItem, formatCurrency, onDataChange: guardarEnNube };

    if (!usuario) return (
        <div className="h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
                <div className="bg-blue-100 p-4 rounded-full inline-block mb-4 text-blue-600"><Cloud size={48} /></div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">Finanzas<span className="text-blue-600">App</span></h1>
                <p className="text-gray-500 mb-6">Ingresa tu nombre para crear tu espacio personal.</p>
                <input type="text" placeholder="Ej: JuanPerez" className="w-full bg-gray-100 p-4 rounded-xl mb-4 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" value={inputUsuario} onChange={(e) => setInputUsuario(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && inputUsuario.trim() && (localStorage.setItem('finanzas_usuario', inputUsuario), setUsuario(inputUsuario))} />
                <button onClick={() => { if (inputUsuario.trim()) { localStorage.setItem('finanzas_usuario', inputUsuario); setUsuario(inputUsuario); } }} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xl shadow-lg active:scale-95">Entrar</button>
            </div>
        </div>
    );

    if (cargando) return <div className="h-screen flex flex-col gap-4 items-center justify-center font-sans text-gray-500 font-bold animate-pulse"><Cloud size={40} className="text-blue-400" />Cargando...</div>;

    // Fecha formateada
    const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col h-screen bg-gray-50 w-full max-w-2xl mx-auto md:shadow-2xl overflow-hidden font-sans">
            {mostrarModalMes && <ModalCierreMes plantillas={plantillasParaProcesar} onProcesar={procesarMes} onCerrar={() => setMostrarModalMes(false)} formatCurrency={formatCurrency} />}

            {/* Header con fecha */}
            <div className="bg-white px-4 py-3 shadow-sm z-20 sticky top-0 border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-gray-800 text-xl">Hola, <span className="text-blue-600 capitalize">{usuario}</span></h1>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-red-400"><LogOut size={14} /></button>
                        </div>
                        <p className="text-xs text-gray-400 capitalize mt-0.5">📅 {fechaHoy}</p>
                        <div className="relative inline-flex items-center mt-1">
                            <Calendar size={12} className="text-gray-400 mr-1" />
                            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="appearance-none bg-transparent text-sm font-bold text-gray-500 outline-none cursor-pointer pr-4">
                                {['Mensual', 'Quincenal', 'Semanal'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-0 text-gray-400" />
                        </div>
                    </div>
                    <div className={`px-3 py-2 rounded-2xl flex items-center gap-1 shadow-sm border ${bolsa >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                        <span className="text-sm font-bold opacity-70">$</span>
                        <span className="text-lg font-black">{new Intl.NumberFormat('es-CO', { notation: "compact", maximumFractionDigits: 1 }).format(bolsa)}</span>
                    </div>
                </div>
            </div>

            {/* Navegación con clases estáticas */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-3xl border py-3 px-4 shadow-2xl z-50 max-w-md w-[calc(100%-2rem)]">
                <div className="flex justify-around items-end w-full">
                    {/* Resumen */}
                    <button onClick={() => setActiveTab('resumen')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'resumen' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'resumen' ? 'p-3 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl scale-125 ring-4 ring-blue-200' : 'p-2 bg-blue-100 text-blue-600'}`}><Brain size={activeTab === 'resumen' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'resumen' ? 'text-[10px] text-blue-700' : 'text-[8px] text-blue-500'}`}>Resumen</span>
                    </button>
                    {/* Ingreso */}
                    <button onClick={() => setActiveTab('ingresos')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'ingresos' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'ingresos' ? 'p-3 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl scale-125 ring-4 ring-green-200' : 'p-2 bg-green-100 text-green-600'}`}><TrendingUp size={activeTab === 'ingresos' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'ingresos' ? 'text-[10px] text-green-700' : 'text-[8px] text-green-500'}`}>Ingreso</span>
                    </button>
                    {/* Gasto */}
                    <button onClick={() => setActiveTab('gastos')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'gastos' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'gastos' ? 'p-3 bg-gradient-to-br from-red-400 to-red-600 text-white shadow-xl scale-125 ring-4 ring-red-200' : 'p-2 bg-red-100 text-red-600'}`}><TrendingDown size={activeTab === 'gastos' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'gastos' ? 'text-[10px] text-red-700' : 'text-[8px] text-red-500'}`}>Gasto</span>
                    </button>
                    {/* Ahorro */}
                    <button onClick={() => setActiveTab('metas')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'metas' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'metas' ? 'p-3 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-xl scale-125 ring-4 ring-cyan-200' : 'p-2 bg-cyan-100 text-cyan-600'}`}><Trophy size={activeTab === 'metas' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'metas' ? 'text-[10px] text-cyan-700' : 'text-[8px] text-cyan-500'}`}>Ahorro</span>
                    </button>
                    {/* Invest */}
                    <button onClick={() => setActiveTab('inversiones')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'inversiones' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'inversiones' ? 'p-3 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-xl scale-125 ring-4 ring-indigo-200' : 'p-2 bg-indigo-100 text-indigo-600'}`}><Rocket size={activeTab === 'inversiones' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'inversiones' ? 'text-[10px] text-indigo-700' : 'text-[8px] text-indigo-500'}`}>Invest</span>
                    </button>
                    {/* Fijos */}
                    <button onClick={() => setActiveTab('presupuesto')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'presupuesto' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'presupuesto' ? 'p-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xl scale-125 ring-4 ring-orange-200' : 'p-2 bg-orange-100 text-orange-600'}`}><Target size={activeTab === 'presupuesto' ? 20 : 16} strokeWidth={2.5} /></div>
                        <span className={`font-bold transition-all ${activeTab === 'presupuesto' ? 'text-[10px] text-orange-700' : 'text-[8px] text-orange-500'}`}>Fijos</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
                {activeTab === 'ingresos' && <ListSection title="Ingresos" items={ingresos} setter={setIngresos} color="text-green-600" bgColor="bg-green-50" icon={TrendingUp} showRecurrente={true} {...listSectionProps} />}
                {activeTab === 'gastos' && <ListSection title="Gastos" items={gastos} setter={setGastos} color="text-red-600" bgColor="bg-red-50" icon={TrendingDown} placeholder="¿Qué pagaste?" {...listSectionProps} />}
                {activeTab === 'metas' && <ListSection title="Metas Ahorro" items={metas} setter={setMetas} color="text-cyan-600" bgColor="bg-cyan-50" icon={Trophy} placeholder="Nombre de la meta" type="meta" {...listSectionProps} />}
                {activeTab === 'inversiones' && <ListSection title="Inversiones" items={inversiones} setter={setInversiones} color="text-indigo-600" bgColor="bg-indigo-50" icon={Rocket} placeholder="¿En qué inviertes?" type="inversion" {...listSectionProps} />}
                {activeTab === 'presupuesto' && <ListSection title="Fijos" items={presupuesto} setter={setPresupuesto} color="text-orange-600" bgColor="bg-orange-50" icon={Target} placeholder="Pago obligatorio" showRecurrente={true} {...listSectionProps} />}
                {activeTab === 'resumen' && <SmartTotals periodo={periodo} bolsa={bolsa} totalIngresos={totalIngresos} totalGastos={totalGastos} totalPatrimonio={totalPatrimonio} obligacionesPendientes={obligacionesPendientes} situacionReal={situacionReal} formatCurrency={formatCurrency} />}
            </main>
        </div>
    );
}
