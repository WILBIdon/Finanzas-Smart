import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Wallet,
    TrendingUp,
    TrendingDown,
    Target,
    Brain,
    Check,
    AlertTriangle,
    Calendar,
    ChevronDown,
    Trophy,
    PiggyBank,
    PlusCircle,
    Pencil,
    Save,
    X,
    Rocket,
    Percent
} from 'lucide-react';

export default function App() {
    const [activeTab, setActiveTab] = useState('resumen');

    // --- ESTADO DEL PERIODO (CICLO) ---
    const [periodo, setPeriodo] = useState(() => {
        return localStorage.getItem('finanzas_periodo') || 'Mensual';
    });

    // --- ESTADOS DE EDICIÓN ---
    const [editingId, setEditingId] = useState(null);

    // --- DATOS ---
    const [ingresos, setIngresos] = useState(() => {
        const saved = localStorage.getItem('finanzas_ingresos');
        return saved ? JSON.parse(saved) : [{ id: 1, concepto: 'Nómina', valor: 2500000 }];
    });

    const [gastos, setGastos] = useState(() => {
        const saved = localStorage.getItem('finanzas_gastos');
        return saved ? JSON.parse(saved) : [
            { id: 1, concepto: 'Pasajes', valor: 150000 },
            { id: 2, concepto: 'Almuerzo', valor: 25000 },
        ];
    });

    const [presupuesto, setPresupuesto] = useState(() => {
        const saved = localStorage.getItem('finanzas_presupuesto');
        return saved ? JSON.parse(saved) : [
            { id: 1, concepto: 'Arriendo', valor: 800000 },
            { id: 2, concepto: 'Servicios', valor: 200000 },
        ];
    });

    const [proyectado, setProyectado] = useState(() => {
        const saved = localStorage.getItem('finanzas_proyectado');
        return saved ? JSON.parse(saved) : [
            { id: 1, concepto: 'Salida Cine', valor: 60000 },
        ];
    });

    const [metas, setMetas] = useState(() => {
        const saved = localStorage.getItem('finanzas_metas');
        return saved ? JSON.parse(saved) : [
            { id: 1, concepto: 'Fondo Emergencia', meta: 1000000, ahorrado: 200000 },
        ];
    });

    // --- NUEVO: INVERSIONES ---
    const [inversiones, setInversiones] = useState(() => {
        const saved = localStorage.getItem('finanzas_inversiones');
        return saved ? JSON.parse(saved) : [
            { id: 1, concepto: 'CDT Digital', valor: 500000, rendimiento: 12 }, // rendimiento es %
        ];
    });

    // Estado del formulario (ahora incluye rendimiento)
    const [newItem, setNewItem] = useState({ concepto: '', valor: '', rendimiento: '' });

    // --- PERSISTENCIA ---
    useEffect(() => localStorage.setItem('finanzas_periodo', periodo), [periodo]);
    useEffect(() => localStorage.setItem('finanzas_ingresos', JSON.stringify(ingresos)), [ingresos]);
    useEffect(() => localStorage.setItem('finanzas_gastos', JSON.stringify(gastos)), [gastos]);
    useEffect(() => localStorage.setItem('finanzas_presupuesto', JSON.stringify(presupuesto)), [presupuesto]);
    useEffect(() => localStorage.setItem('finanzas_proyectado', JSON.stringify(proyectado)), [proyectado]);
    useEffect(() => localStorage.setItem('finanzas_metas', JSON.stringify(metas)), [metas]);
    useEffect(() => localStorage.setItem('finanzas_inversiones', JSON.stringify(inversiones)), [inversiones]);

    // --- CÁLCULOS ---
    const totalIngresos = ingresos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalPresupuesto = presupuesto.reduce((acc, curr) => acc + curr.valor, 0);
    const totalProyectado = proyectado.reduce((acc, curr) => acc + curr.valor, 0);
    const totalAhorrado = metas.reduce((acc, curr) => acc + curr.ahorrado, 0);
    const totalInvertido = inversiones.reduce((acc, curr) => acc + curr.valor, 0);

    // Patrimonio Total = Ahorro (Seguro) + Inversión (Riesgo/Crecimiento)
    const totalPatrimonio = totalAhorrado + totalInvertido;

    // Bolsa: Liquidez disponible HOY
    const bolsa = totalIngresos - totalGastos - totalPatrimonio;

    const obligacionesPendientes = totalPresupuesto + totalProyectado;
    const situacionReal = bolsa - obligacionesPendientes;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    // --- LÓGICA DE GUARDADO ---
    const handleSaveItem = (setter, list, type = 'normal') => { // type: 'normal', 'meta', 'inversion'
        if (!newItem.concepto || !newItem.valor) return;

        if (editingId) {
            // ACTUALIZAR
            const updatedList = list.map(item => {
                if (item.id === editingId) {
                    if (type === 'meta') {
                        return { ...item, concepto: newItem.concepto, meta: parseInt(newItem.valor) };
                    }
                    if (type === 'inversion') {
                        return { ...item, concepto: newItem.concepto, valor: parseInt(newItem.valor), rendimiento: parseFloat(newItem.rendimiento || 0) };
                    }
                    return { ...item, concepto: newItem.concepto, valor: parseInt(newItem.valor) };
                }
                return item;
            });
            setter(updatedList);
            setEditingId(null);
        } else {
            // CREAR
            const baseItem = { id: Date.now(), concepto: newItem.concepto };

            if (type === 'meta') {
                setter([...list, { ...baseItem, meta: parseInt(newItem.valor), ahorrado: 0 }]);
            } else if (type === 'inversion') {
                setter([...list, { ...baseItem, valor: parseInt(newItem.valor), rendimiento: parseFloat(newItem.rendimiento || 0) }]);
            } else {
                setter([...list, { ...baseItem, valor: parseInt(newItem.valor) }]);
            }
        }
        setNewItem({ concepto: '', valor: '', rendimiento: '' });
    };

    const deleteItem = (id, setter, list) => {
        if (editingId === id) cancelEdit();
        setter(list.filter(i => i.id !== id));
    };

    const startEdit = (item, type = 'normal') => {
        setEditingId(item.id);
        setNewItem({
            concepto: item.concepto,
            valor: type === 'meta' ? item.meta : item.valor,
            rendimiento: type === 'inversion' ? item.rendimiento : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewItem({ concepto: '', valor: '', rendimiento: '' });
    };

    const abonarMeta = (id, valorAbono) => {
        if (!valorAbono || isNaN(valorAbono)) return;
        const nuevasMetas = metas.map(m => {
            if (m.id === id) {
                return { ...m, ahorrado: m.ahorrado + parseInt(valorAbono) };
            }
            return m;
        });
        setMetas(nuevasMetas);
    };

    // --- COMPONENTES ---
    const ListSection = ({ title, items, setter, color, bgColor, icon: Icon, placeholder, type = 'normal' }) => (
        <div className="pb-32 animate-in fade-in zoom-in duration-300">
            {/* Header Sección */}
            <div className={`p-6 rounded-b-3xl shadow-sm mb-6 ${bgColor} border-b-2 border-${color}-200`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-full bg-white/60 ${color}`}>
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black ${color} leading-none`}>{title}</h2>
                        <span className={`text-sm font-bold opacity-70 uppercase tracking-wide ${color}`}>
                            {type === 'meta' || type === 'inversion' ? 'Patrimonio' : periodo}
                        </span>
                    </div>
                </div>
                <div className="text-right mt-2">
                    {type === 'meta' ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold uppercase opacity-60">Total Ahorrado</span>
                            <p className={`text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(totalAhorrado)}</p>
                        </div>
                    ) : (
                        <p className={`text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(items.reduce((acc, i) => acc + i.valor, 0))}</p>
                    )}
                </div>
            </div>

            <div className="px-4">
                {/* Formulario de Entrada */}
                <div className={`bg-white p-3 rounded-2xl shadow-md border-2 transition-colors flex flex-col gap-3 mb-6 ${editingId ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100'}`}>

                    {editingId && (
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Modo Edición</span>
                            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={placeholder || "Concepto..."}
                            className={`flex-1 rounded-xl px-4 py-3 text-lg outline-none focus:ring-2 transition-all placeholder-gray-400 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                            value={newItem.concepto}
                            onChange={(e) => setNewItem({ ...newItem, concepto: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={type === 'meta' ? "Meta Total ($)" : "$0"}
                            className={`flex-1 rounded-xl px-4 py-3 text-xl font-bold outline-none focus:ring-2 transition-all text-gray-700 placeholder-gray-300 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                            value={newItem.valor}
                            onChange={(e) => setNewItem({ ...newItem, valor: e.target.value })}
                        />

                        {/* CAMPO EXTRA SOLO PARA INVERSIÓN: RENDIMIENTO % */}
                        {type === 'inversion' && (
                            <div className="relative w-24">
                                <input
                                    type="number"
                                    placeholder="%"
                                    className={`w-full h-full rounded-xl pl-3 pr-6 py-3 text-lg font-bold outline-none focus:ring-2 transition-all text-center ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                                    value={newItem.rendimiento}
                                    onChange={(e) => setNewItem({ ...newItem, rendimiento: e.target.value })}
                                />
                                <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        <button
                            onClick={() => handleSaveItem(setter, items, type)}
                            className={`px-6 rounded-xl text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    color.includes('green') ? 'bg-green-600' :
                                        color.includes('red') ? 'bg-red-600' :
                                            color.includes('cyan') ? 'bg-cyan-600' :
                                                color.includes('indigo') ? 'bg-indigo-600' : // Para inversión
                                                    color.includes('orange') ? 'bg-orange-600' : 'bg-purple-600'
                                }`}
                        >
                            {editingId ? <Save size={32} strokeWidth={2.5} /> : <Plus size={32} strokeWidth={3} />}
                        </button>
                    </div>
                </div>

                {/* Lista de Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border relative overflow-hidden transition-all ${editingId === item.id ? 'border-yellow-400 ring-2 ring-yellow-100 bg-yellow-50' : 'border-gray-100'}`}>

                            {/* --- TARJETA DE META --- */}
                            {type === 'meta' && (
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-gray-800 text-xl block">{item.concepto}</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meta: {formatCurrency(item.meta)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(item, type)} className="text-blue-300 hover:text-blue-500 p-2 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                            <button onClick={() => deleteItem(item.id, setter, items)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
                                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((item.ahorrado / item.meta) * 100, 100)}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-cyan-600">{formatCurrency(item.ahorrado)}</span>
                                        <button
                                            onClick={() => { const abono = prompt(`Abonar a: ${item.concepto}`); if (abono) abonarMeta(item.id, abono); }}
                                            className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-cyan-200 active:scale-95 transition-colors flex items-center gap-2"
                                        >
                                            <PlusCircle size={18} /> Abonar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- TARJETA DE INVERSIÓN --- */}
                            {type === 'inversion' && (
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-lg leading-tight">{item.concepto}</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
                                                    Esp: {item.rendimiento}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(item, type)} className="text-blue-300 hover:text-blue-500 p-2 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                            <button onClick={() => deleteItem(item.id, setter, items)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between border-t border-gray-50 pt-3">
                                        <div>
                                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Invertido</span>
                                            <span className="text-2xl font-black text-indigo-600">{formatCurrency(item.valor)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Valor Proyectado</span>
                                            <div className="flex items-center gap-1 justify-end text-green-600">
                                                <TrendingUp size={16} />
                                                <span className="text-lg font-bold">
                                                    {formatCurrency(item.valor + (item.valor * (item.rendimiento / 100)))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TARJETA NORMAL --- */}
                            {type === 'normal' && (
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-lg">{item.concepto}</span>
                                        <span className="text-sm text-gray-400 font-medium">Registrado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-gray-700 text-xl mr-2">{formatCurrency(item.valor)}</span>
                                        <button onClick={() => startEdit(item, type)} className="text-blue-300 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 p-3 rounded-xl transition-all active:scale-90"><Pencil size={20} /></button>
                                        <button onClick={() => deleteItem(item.id, setter, items)} className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-3 rounded-xl transition-all active:scale-90"><Trash2 size={24} /></button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center text-gray-400 py-12 flex flex-col items-center opacity-50">
                            <Icon size={48} className="mb-2" />
                            <p className="text-lg font-medium">Sin registros</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const SmartTotals = () => (
        <div className="p-4 pb-32 space-y-5 animate-in slide-in-from-bottom duration-500">
            {/* BOLSA GIGANTE */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

                <div className="flex items-center justify-between mb-2 opacity-90 relative z-10">
                    <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full">
                        <Wallet size={20} />
                        <span className="font-bold text-sm uppercase tracking-wide">Liquidez (Disponible)</span>
                    </div>
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20">{periodo}</span>
                </div>

                <div className="text-5xl font-black mb-6 tracking-tight relative z-10">{formatCurrency(bolsa)}</div>

                <div className="flex gap-2 text-blue-100 border-t border-white/10 pt-4 relative z-10 text-xs">
                    <div className="flex-1 bg-blue-900/20 p-2 rounded-xl text-center">
                        <span className="block opacity-70 font-bold mb-1">Ingresos</span>
                        <span className="font-bold text-green-300">{formatCurrency(totalIngresos)}</span>
                    </div>
                    <div className="flex-1 bg-blue-900/20 p-2 rounded-xl text-center">
                        <span className="block opacity-70 font-bold mb-1">Gastos</span>
                        <span className="font-bold text-red-300">-{formatCurrency(totalGastos)}</span>
                    </div>
                </div>
            </div>

            {/* CEREBRO */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="text-indigo-600 bg-indigo-50 p-3 rounded-2xl"><Brain size={32} /></div>
                    <div>
                        <h3 className="text-xl font-black text-gray-800 leading-none">Diagnóstico</h3>
                        <span className="text-sm font-medium text-gray-400">Salud Financiera</span>
                    </div>
                </div>

                <div className="space-y-4 text-base">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Wallet size={16} className="text-gray-400" />
                            <span className="text-gray-500 font-medium">Liquidez Real:</span>
                        </div>
                        <span className="font-black text-blue-600 text-lg">{formatCurrency(bolsa)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                        <div className="flex items-center gap-2">
                            <PiggyBank size={16} className="text-cyan-500" />
                            <span className="text-cyan-700 font-bold">Patrimonio (Ahorro+Inv):</span>
                        </div>
                        <span className="font-black text-cyan-600 text-lg">{formatCurrency(totalPatrimonio)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-orange-400" />
                            <span className="text-gray-500 font-medium">Por pagar:</span>
                        </div>
                        <span className="font-black text-orange-600 text-lg">-{formatCurrency(obligacionesPendientes)}</span>
                    </div>
                </div>

                <div className={`mt-6 p-5 rounded-2xl border-2 flex gap-4 items-center ${situacionReal >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`p-3 rounded-full flex-shrink-0 ${situacionReal >= 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                        {situacionReal >= 0 ? <Check size={32} strokeWidth={3} /> : <AlertTriangle size={32} strokeWidth={3} />}
                    </div>
                    <div>
                        <h4 className={`text-lg font-black ${situacionReal >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                            {situacionReal >= 0 ? "¡Excelente Control!" : "¡Falta Liquidez!"}
                        </h4>
                        <p className={`text-base font-medium leading-tight mt-1 ${situacionReal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {situacionReal >= 0
                                ? `Tienes ${formatCurrency(situacionReal)} libres DESPUÉS de asegurar tu patrimonio y obligaciones.`
                                : `Te faltan ${formatCurrency(Math.abs(situacionReal))} para el mes.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-white px-5 py-4 shadow-sm z-20 flex justify-between items-center sticky top-0 border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="font-black text-gray-800 text-2xl tracking-tight leading-none mb-1">Finanzas<span className="text-blue-600">App</span></h1>
                    <div className="relative inline-flex items-center group">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400"><Calendar size={14} /></div>
                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="appearance-none bg-transparent pl-5 pr-6 py-1 text-sm font-bold text-gray-500 outline-none focus:text-blue-600 active:text-blue-600 transition-colors cursor-pointer"
                        >
                            <option value="Mensual">Mensual</option>
                            <option value="Quincenal">Quincenal</option>
                            <option value="Semanal">Semanal</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-400"><ChevronDown size={14} strokeWidth={3} /></div>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-2xl flex items-center gap-1 shadow-sm border border-gray-100 ${bolsa >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                    <span className="text-sm font-bold opacity-70 mr-1">$</span>
                    <span className="text-xl font-black">{new Intl.NumberFormat('es-CO', { notation: "compact", maximumFractionDigits: 1 }).format(bolsa)}</span>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto no-scrollbar">
                {activeTab === 'ingresos' && <ListSection title="Ingresos" items={ingresos} setter={setIngresos} color="text-green-600" bgColor="bg-green-50" icon={TrendingUp} />}
                {activeTab === 'gastos' && <ListSection title="Gastos" items={gastos} setter={setGastos} color="text-red-600" bgColor="bg-red-50" icon={TrendingDown} placeholder="¿Qué pagaste?" />}
                {activeTab === 'metas' && <ListSection title="Metas Ahorro" items={metas} setter={setMetas} color="text-cyan-600" bgColor="bg-cyan-50" icon={Trophy} placeholder="Nombre de la meta" type="meta" />}
                {activeTab === 'inversiones' && <ListSection title="Inversiones" items={inversiones} setter={setInversiones} color="text-indigo-600" bgColor="bg-indigo-50" icon={Rocket} placeholder="¿En qué inviertes?" type="inversion" />}
                {activeTab === 'presupuesto' && <ListSection title="Fijos" items={presupuesto} setter={setPresupuesto} color="text-orange-600" bgColor="bg-orange-50" icon={Target} placeholder="Pago obligatorio" />}
                {activeTab === 'proyectado' && <ListSection title="Deseos" items={proyectado} setter={setProyectado} color="text-purple-600" bgColor="bg-purple-50" icon={Wallet} placeholder="Gasto opcional" />}
                {activeTab === 'resumen' && <SmartTotals />}
            </main>

            {/* Navegación Scroll Horizontal */}
            <nav className="bg-white border-t border-gray-200 pb-6 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-30 overflow-x-auto">
                <div className="flex justify-between items-end px-2 min-w-[380px]">
                    <button onClick={() => setActiveTab('ingresos')} className="group flex flex-col items-center w-14 gap-1">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === 'ingresos' ? 'bg-green-100 text-green-700 scale-110' : 'text-gray-400'}`}><TrendingUp size={24} strokeWidth={activeTab === 'ingresos' ? 3 : 2} /></div>
                        <span className={`text-[10px] font-bold ${activeTab === 'ingresos' ? 'text-green-700' : 'text-gray-400'}`}>Ingreso</span>
                    </button>
                    <button onClick={() => setActiveTab('gastos')} className="group flex flex-col items-center w-14 gap-1">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === 'gastos' ? 'bg-red-100 text-red-700 scale-110' : 'text-gray-400'}`}><TrendingDown size={24} strokeWidth={activeTab === 'gastos' ? 3 : 2} /></div>
                        <span className={`text-[10px] font-bold ${activeTab === 'gastos' ? 'text-red-700' : 'text-gray-400'}`}>Gasto</span>
                    </button>
                    <button onClick={() => setActiveTab('resumen')} className="relative -top-5 mx-1">
                        <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-400/50 active:scale-95 transition-transform border-[5px] border-gray-50 flex items-center justify-center"><Brain size={32} strokeWidth={2.5} /></div>
                    </button>
                    <button onClick={() => setActiveTab('metas')} className="group flex flex-col items-center w-14 gap-1">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === 'metas' ? 'bg-cyan-100 text-cyan-700 scale-110' : 'text-gray-400'}`}><Trophy size={24} strokeWidth={activeTab === 'metas' ? 3 : 2} /></div>
                        <span className={`text-[10px] font-bold ${activeTab === 'metas' ? 'text-cyan-700' : 'text-gray-400'}`}>Ahorro</span>
                    </button>
                    {/* NUEVO BOTÓN INVERSIÓN */}
                    <button onClick={() => setActiveTab('inversiones')} className="group flex flex-col items-center w-14 gap-1">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === 'inversiones' ? 'bg-indigo-100 text-indigo-700 scale-110' : 'text-gray-400'}`}><Rocket size={24} strokeWidth={activeTab === 'inversiones' ? 3 : 2} /></div>
                        <span className={`text-[10px] font-bold ${activeTab === 'inversiones' ? 'text-indigo-700' : 'text-gray-400'}`}>Invest</span>
                    </button>
                    <button onClick={() => setActiveTab('presupuesto')} className="group flex flex-col items-center w-14 gap-1">
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === 'presupuesto' ? 'bg-orange-100 text-orange-700 scale-110' : 'text-gray-400'}`}><Target size={24} strokeWidth={activeTab === 'presupuesto' ? 3 : 2} /></div>
                        <span className={`text-[10px] font-bold ${activeTab === 'presupuesto' ? 'text-orange-700' : 'text-gray-400'}`}>Fijos</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
