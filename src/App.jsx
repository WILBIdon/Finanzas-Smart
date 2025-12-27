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
    Percent,
    Cloud,
    LogOut
} from 'lucide-react';

// --- COMPONENTE EXTRAÍDO: ListSection ---
const ListSection = ({
    title, items, setter, color, bgColor, icon: Icon, placeholder, type = 'normal',
    periodo, totalAhorrado, editingId, setEditingId, newItem, setNewItem, formatCurrency, onDataChange
}) => {

    const handleSaveItem = () => {
        if (!newItem.concepto || !newItem.valor) return;

        let updatedList;
        if (editingId) {
            updatedList = items.map(item => {
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
            setEditingId(null);
        } else {
            const baseItem = { id: Date.now(), concepto: newItem.concepto };
            if (type === 'meta') {
                updatedList = [...items, { ...baseItem, meta: parseInt(newItem.valor), ahorrado: 0 }];
            } else if (type === 'inversion') {
                updatedList = [...items, { ...baseItem, valor: parseInt(newItem.valor), rendimiento: parseFloat(newItem.rendimiento || 0) }];
            } else {
                updatedList = [...items, { ...baseItem, valor: parseInt(newItem.valor) }];
            }
        }

        setter(updatedList);
        setNewItem({ concepto: '', valor: '', rendimiento: '' });
        // Trigger para guardar en la nube
        if (onDataChange) onDataChange();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewItem({ concepto: '', valor: '', rendimiento: '' });
    };

    const deleteItem = (id) => {
        if (editingId === id) cancelEdit();
        const updatedList = items.filter(i => i.id !== id);
        setter(updatedList);
        if (onDataChange) onDataChange();
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setNewItem({
            concepto: item.concepto,
            valor: type === 'meta' ? item.meta : item.valor,
            rendimiento: type === 'inversion' ? item.rendimiento : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const abonarMeta = (id, valorAbono) => {
        if (!valorAbono || isNaN(valorAbono)) return;
        const nuevasMetas = items.map(m => {
            if (m.id === id) {
                return { ...m, ahorrado: m.ahorrado + parseInt(valorAbono) };
            }
            return m;
        });
        setter(nuevasMetas);
        if (onDataChange) onDataChange();
    };

    return (
        <div className="pb-4 animate-in fade-in zoom-in duration-300">
            {/* Header Sección */}
            <div className={`p-4 sm:p-6 rounded-b-3xl shadow-sm mb-6 ${bgColor} border-b-2 border-${color}-200`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 sm:p-3 rounded-full bg-white/60 ${color}`}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className={`text-xl sm:text-2xl font-black ${color} leading-none`}>{title}</h2>
                        <span className={`text-xs sm:text-sm font-bold opacity-70 uppercase tracking-wide ${color}`}>
                            {type === 'meta' || type === 'inversion' ? 'Patrimonio' : periodo}
                        </span>
                    </div>
                </div>
                <div className="text-right mt-2">
                    {type === 'meta' ? (
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold uppercase opacity-60">Total Ahorrado</span>
                            <p className={`text-2xl sm:text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(totalAhorrado)}</p>
                        </div>
                    ) : (
                        <p className={`text-2xl sm:text-4xl font-black tracking-tighter ${color}`}>{formatCurrency(items.reduce((acc, i) => acc + i.valor, 0))}</p>
                    )}
                </div>
            </div>

            <div className="px-3 sm:px-4">
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
                            className={`flex-1 rounded-xl px-3 sm:px-4 py-3 text-base sm:text-lg outline-none focus:ring-2 transition-all placeholder-gray-400 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                            value={newItem.concepto}
                            onChange={(e) => setNewItem({ ...newItem, concepto: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={type === 'meta' ? "Meta Total ($)" : "$0"}
                            className={`flex-1 rounded-xl px-3 sm:px-4 py-3 text-lg sm:text-xl font-bold outline-none focus:ring-2 transition-all text-gray-700 placeholder-gray-300 ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                            value={newItem.valor}
                            onChange={(e) => setNewItem({ ...newItem, valor: e.target.value })}
                        />

                        {/* CAMPO EXTRA SOLO PARA INVERSIÓN: RENDIMIENTO % */}
                        {type === 'inversion' && (
                            <div className="relative w-20 sm:w-24">
                                <input
                                    type="number"
                                    placeholder="%"
                                    className={`w-full h-full rounded-xl pl-2 sm:pl-3 pr-6 py-3 text-base sm:text-lg font-bold outline-none focus:ring-2 transition-all text-center ${editingId ? 'bg-white focus:ring-yellow-400' : 'bg-gray-50 focus:ring-blue-200'}`}
                                    value={newItem.rendimiento}
                                    onChange={(e) => setNewItem({ ...newItem, rendimiento: e.target.value })}
                                />
                                <Percent size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        <button
                            onClick={handleSaveItem}
                            className={`px-4 sm:px-6 rounded-xl text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' :
                                color.includes('green') ? 'bg-green-600' :
                                    color.includes('red') ? 'bg-red-600' :
                                        color.includes('cyan') ? 'bg-cyan-600' :
                                            color.includes('indigo') ? 'bg-indigo-600' :
                                                color.includes('orange') ? 'bg-orange-600' : 'bg-purple-600'
                                }`}
                        >
                            {editingId ? <Save size={28} strokeWidth={2.5} /> : <Plus size={28} strokeWidth={3} />}
                        </button>
                    </div>
                </div>

                {/* Lista de Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className={`bg-white p-3 sm:p-4 rounded-2xl shadow-sm border relative overflow-hidden transition-all ${editingId === item.id ? 'border-yellow-400 ring-2 ring-yellow-100 bg-yellow-50' : 'border-gray-100'}`}>

                            {/* --- TARJETA DE META --- */}
                            {type === 'meta' && (
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-gray-800 text-lg sm:text-xl block">{item.concepto}</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meta: {formatCurrency(item.meta)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(item)} className="text-blue-300 hover:text-blue-500 p-2 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                            <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
                                        <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((item.ahorrado / item.meta) * 100, 100)}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl sm:text-2xl font-black text-cyan-600">{formatCurrency(item.ahorrado)}</span>
                                        <button
                                            onClick={() => { const abono = prompt(`Abonar a: ${item.concepto}`); if (abono) abonarMeta(item.id, abono); }}
                                            className="bg-cyan-100 text-cyan-700 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm hover:bg-cyan-200 active:scale-95 transition-colors flex items-center gap-2"
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
                                            <span className="font-bold text-gray-800 text-base sm:text-lg leading-tight">{item.concepto}</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100">
                                                    Esp: {item.rendimiento}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(item)} className="text-blue-300 hover:text-blue-500 p-2 bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                            <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-end justify-between border-t border-gray-50 pt-3">
                                        <div>
                                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Invertido</span>
                                            <span className="text-xl sm:text-2xl font-black text-indigo-600">{formatCurrency(item.valor)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Valor Proyectado</span>
                                            <div className="flex items-center gap-1 justify-end text-green-600">
                                                <TrendingUp size={16} />
                                                <span className="text-base sm:text-lg font-bold">
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
                                        <span className="font-bold text-gray-800 text-base sm:text-lg">{item.concepto}</span>
                                        <span className="text-sm text-gray-400 font-medium">Registrado</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="font-black text-gray-700 text-lg sm:text-xl mr-1 sm:mr-2">{formatCurrency(item.valor)}</span>
                                        <button onClick={() => startEdit(item)} className="text-blue-300 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 p-2 sm:p-3 rounded-xl transition-all active:scale-90"><Pencil size={18} /></button>
                                        <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 sm:p-3 rounded-xl transition-all active:scale-90"><Trash2 size={20} /></button>
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
};

// --- COMPONENTE EXTRAÍDO: SmartTotals ---
const SmartTotals = ({ periodo, bolsa, totalIngresos, totalGastos, totalPatrimonio, obligacionesPendientes, situacionReal, formatCurrency }) => (
    <div className="p-3 sm:p-4 pb-4 space-y-4 sm:space-y-5 animate-in slide-in-from-bottom duration-500">
        {/* BOLSA GIGANTE */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-[2rem] shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

            <div className="flex items-center justify-between mb-2 opacity-90 relative z-10">
                <div className="flex items-center gap-2 bg-blue-900/30 px-2 sm:px-3 py-1 rounded-full">
                    <Wallet size={18} />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">Liquidez (Disponible)</span>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2 sm:px-3 py-1 rounded-full border border-white/20">{periodo}</span>
            </div>

            <div className="text-3xl sm:text-5xl font-black mb-4 sm:mb-6 tracking-tight relative z-10">{formatCurrency(bolsa)}</div>

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
        <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-sm border-2 border-gray-100">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                <div className="text-indigo-600 bg-indigo-50 p-2 sm:p-3 rounded-2xl"><Brain size={28} /></div>
                <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-800 leading-none">Diagnóstico</h3>
                    <span className="text-sm font-medium text-gray-400">Salud Financiera</span>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-gray-400" />
                        <span className="text-gray-500 font-medium">Liquidez Real:</span>
                    </div>
                    <span className="font-black text-blue-600 text-base sm:text-lg">{formatCurrency(bolsa)}</span>
                </div>

                <div className="flex justify-between items-center p-2 sm:p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                    <div className="flex items-center gap-2">
                        <PiggyBank size={16} className="text-cyan-500" />
                        <span className="text-cyan-700 font-bold text-xs sm:text-base">Patrimonio (Ahorro+Inv):</span>
                    </div>
                    <span className="font-black text-cyan-600 text-base sm:text-lg">{formatCurrency(totalPatrimonio)}</span>
                </div>

                <div className="flex justify-between items-center p-2 sm:p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-orange-400" />
                        <span className="text-gray-500 font-medium">Por pagar:</span>
                    </div>
                    <span className="font-black text-orange-600 text-base sm:text-lg">-{formatCurrency(obligacionesPendientes)}</span>
                </div>
            </div>

            <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl border-2 flex gap-3 sm:gap-4 items-center ${situacionReal >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${situacionReal >= 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {situacionReal >= 0 ? <Check size={28} strokeWidth={3} /> : <AlertTriangle size={28} strokeWidth={3} />}
                </div>
                <div>
                    <h4 className={`text-base sm:text-lg font-black ${situacionReal >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {situacionReal >= 0 ? "¡Excelente Control!" : "¡Falta Liquidez!"}
                    </h4>
                    <p className={`text-sm sm:text-base font-medium leading-tight mt-1 ${situacionReal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
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

// --- COMPONENTE PRINCIPAL ---
export default function App() {
    // --- ESTADO DE USUARIO (NUBE) ---
    const [usuario, setUsuario] = useState(localStorage.getItem('finanzas_usuario') || '');
    const [inputUsuario, setInputUsuario] = useState('');
    const [cargando, setCargando] = useState(false);

    const [activeTab, setActiveTab] = useState('resumen');

    // --- ESTADO DEL PERIODO (CICLO) ---
    const [periodo, setPeriodo] = useState('Mensual');

    // --- ESTADOS DE EDICIÓN ---
    const [editingId, setEditingId] = useState(null);

    // --- DATOS (Inicializan vacíos hasta que cargue la nube) ---
    const [ingresos, setIngresos] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    const [proyectado, setProyectado] = useState([]);
    const [metas, setMetas] = useState([]);
    const [inversiones, setInversiones] = useState([]);

    // Estado del formulario
    const [newItem, setNewItem] = useState({ concepto: '', valor: '', rendimiento: '' });

    // --- EFECTO: CARGAR DATOS AL INICIAR SESIÓN ---
    useEffect(() => {
        if (usuario) {
            setCargando(true);
            // Cargar datos del servidor simulado
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
                    } else {
                        // Usuario nuevo: cargar datos de ejemplo
                        setIngresos([{ id: 1, concepto: 'Nómina', valor: 2500000 }]);
                        setGastos([{ id: 1, concepto: 'Pasajes', valor: 150000 }]);
                        setPresupuesto([{ id: 1, concepto: 'Arriendo', valor: 800000 }]);
                    }
                })
                .catch(err => {
                    console.error("Error cargando nube", err);
                    alert("Error conectando con el servidor");
                })
                .finally(() => setCargando(false));
        }
    }, [usuario]);

    // --- FUNCIÓN: GUARDAR EN NUBE (Debounced o Manual) ---
    const guardarEnNube = () => {
        if (!usuario) return;
        const data = { ingresos, gastos, presupuesto, proyectado, metas, inversiones, periodo };

        // Simular guardado silencioso (sin alert intrusivo cada vez, solo log o indicador visual)
        fetch(`/api/save/${usuario}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(res => {
                console.log(res.message);
            })
            .catch(err => console.error("Error guardando", err));
    };

    // Auto-guardado: Cuando cambien los datos, guardar en el servidor
    useEffect(() => {
        if (usuario && !cargando) {
            const timeoutId = setTimeout(() => {
                guardarEnNube();
            }, 1000); // Guardar 1 segundo después del último cambio
            return () => clearTimeout(timeoutId);
        }
    }, [ingresos, gastos, presupuesto, proyectado, metas, inversiones, periodo]);

    const handleLogout = () => {
        setUsuario('');
        localStorage.removeItem('finanzas_usuario');
        setInputUsuario('');
    };

    // --- CÁLCULOS ---
    const totalIngresos = ingresos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalPresupuesto = presupuesto.reduce((acc, curr) => acc + curr.valor, 0);
    const totalProyectado = proyectado.reduce((acc, curr) => acc + curr.valor, 0);
    const totalAhorrado = metas.reduce((acc, curr) => acc + curr.ahorrado, 0);
    const totalInvertido = inversiones.reduce((acc, curr) => acc + curr.valor, 0);

    const totalPatrimonio = totalAhorrado + totalInvertido;
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

    // Props comunes para ListSection
    const listSectionProps = {
        periodo,
        totalAhorrado,
        editingId,
        setEditingId,
        newItem,
        setNewItem,
        formatCurrency,
        onDataChange: guardarEnNube // Callback para forzar guardado inmediato al borrar/editar
    };

    // --- PANTALLA DE LOGIN (Si no hay usuario) ---
    if (!usuario) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 font-sans">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4 text-blue-600">
                        <Cloud size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">Finanzas<span className="text-blue-600">App</span></h1>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        Ingresa un nombre para crear tu espacio personal en la nube.
                    </p>
                    <input
                        type="text"
                        placeholder="Ej: JuanPerez"
                        className="w-full bg-gray-100 p-4 rounded-xl mb-4 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={inputUsuario}
                        onChange={(e) => setInputUsuario(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && inputUsuario.trim() && (localStorage.setItem('finanzas_usuario', inputUsuario), setUsuario(inputUsuario))}
                    />
                    <button
                        onClick={() => {
                            if (inputUsuario.trim()) {
                                localStorage.setItem('finanzas_usuario', inputUsuario);
                                setUsuario(inputUsuario);
                            }
                        }}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    >
                        Entrar
                    </button>
                    <p className="mt-4 text-xs text-gray-400">Tus datos se guardarán automáticamente.</p>
                </div>
            </div>
        );
    }

    if (cargando) return <div className="h-screen flex flex-col gap-4 items-center justify-center font-sans text-gray-500 font-bold animate-pulse"><Cloud size={40} className="text-blue-400" />Cargando tu nube...</div>;

    // --- APP PRINCIPAL ---
    return (
        <div className="flex flex-col h-screen bg-gray-50 w-full max-w-2xl mx-auto md:shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-white px-3 sm:px-5 py-3 sm:py-4 shadow-sm z-20 flex justify-between items-center sticky top-0 border-b border-gray-100">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h1 className="font-black text-gray-800 text-xl sm:text-2xl tracking-tight leading-none">Hola, <span className="text-blue-600 capitalize">{usuario}</span></h1>
                        <button onClick={handleLogout} className="text-gray-300 hover:text-red-400" title="Salir"><LogOut size={16} /></button>
                    </div>

                    <div className="relative inline-flex items-center group mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-gray-400"><Calendar size={14} /></div>
                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="appearance-none bg-transparent pl-5 pr-6 py-0 text-sm font-bold text-gray-500 outline-none focus:text-blue-600 active:text-blue-600 transition-colors cursor-pointer"
                        >
                            <option value="Mensual">Mensual</option>
                            <option value="Quincenal">Quincenal</option>
                            <option value="Semanal">Semanal</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-400"><ChevronDown size={14} strokeWidth={3} /></div>
                    </div>
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-2xl flex items-center gap-1 shadow-sm border border-gray-100 ${bolsa >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                    <span className="text-sm font-bold opacity-70 mr-1">$</span>
                    <span className="text-lg sm:text-xl font-black">{new Intl.NumberFormat('es-CO', { notation: "compact", maximumFractionDigits: 1 }).format(bolsa)}</span>
                </div>
            </div>

            {/* Navegación Flotante Fija - EN LA PARTE INFERIOR */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200 py-3 px-4 shadow-2xl shadow-gray-400/30 z-50 max-w-md w-[calc(100%-2rem)]">
                <div className="flex justify-around items-end px-1 w-full">
                    {/* Resumen - Azul PRIMERO */}
                    <button onClick={() => setActiveTab('resumen')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'resumen' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-2xl transition-all duration-300 ${activeTab === 'resumen' ? 'p-3 bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-400/50 scale-125 ring-4 ring-blue-200' : 'p-2 bg-gradient-to-br from-blue-400 to-blue-600 shadow-md shadow-blue-300/40'} text-white`}>
                            <Brain size={activeTab === 'resumen' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'resumen' ? 'text-[11px] text-blue-700' : 'text-[9px] text-blue-500'}`}>Resumen</span>
                    </button>

                    {/* Ingreso - Verde */}
                    <button onClick={() => setActiveTab('ingresos')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'ingresos' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'ingresos' ? 'p-3 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-300/50 scale-125 ring-4 ring-green-200' : 'p-2 bg-green-100 text-green-600'}`}>
                            <TrendingUp size={activeTab === 'ingresos' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'ingresos' ? 'text-[11px] text-green-600' : 'text-[9px] text-green-500'}`}>Ingreso</span>
                    </button>

                    {/* Gasto - Rojo */}
                    <button onClick={() => setActiveTab('gastos')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'gastos' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'gastos' ? 'p-3 bg-gradient-to-br from-red-400 to-red-600 text-white shadow-xl shadow-red-300/50 scale-125 ring-4 ring-red-200' : 'p-2 bg-red-100 text-red-500'}`}>
                            <TrendingDown size={activeTab === 'gastos' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'gastos' ? 'text-[11px] text-red-600' : 'text-[9px] text-red-500'}`}>Gasto</span>
                    </button>

                    {/* Ahorro - Cyan */}
                    <button onClick={() => setActiveTab('metas')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'metas' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'metas' ? 'p-3 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-xl shadow-cyan-300/50 scale-125 ring-4 ring-cyan-200' : 'p-2 bg-cyan-100 text-cyan-600'}`}>
                            <Trophy size={activeTab === 'metas' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'metas' ? 'text-[11px] text-cyan-600' : 'text-[9px] text-cyan-500'}`}>Ahorro</span>
                    </button>

                    {/* Invest - Indigo */}
                    <button onClick={() => setActiveTab('inversiones')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'inversiones' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'inversiones' ? 'p-3 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-xl shadow-indigo-300/50 scale-125 ring-4 ring-indigo-200' : 'p-2 bg-indigo-100 text-indigo-600'}`}>
                            <Rocket size={activeTab === 'inversiones' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'inversiones' ? 'text-[11px] text-indigo-600' : 'text-[9px] text-indigo-500'}`}>Invest</span>
                    </button>

                    {/* Fijos - Naranja */}
                    <button onClick={() => setActiveTab('presupuesto')} className={`flex flex-col items-center gap-1 py-1 px-2 transition-all duration-300 ${activeTab === 'presupuesto' ? '-translate-y-2' : ''}`}>
                        <div className={`rounded-xl transition-all duration-300 ${activeTab === 'presupuesto' ? 'p-3 bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xl shadow-orange-300/50 scale-125 ring-4 ring-orange-200' : 'p-2 bg-orange-100 text-orange-600'}`}>
                            <Target size={activeTab === 'presupuesto' ? 22 : 18} strokeWidth={2.5} />
                        </div>
                        <span className={`font-bold transition-all duration-300 ${activeTab === 'presupuesto' ? 'text-[11px] text-orange-600' : 'text-[9px] text-orange-500'}`}>Fijos</span>
                    </button>
                </div>
            </nav>

            {/* Contenido - Con padding bottom para el nav flotante */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
                {activeTab === 'ingresos' && <ListSection title="Ingresos" items={ingresos} setter={setIngresos} color="text-green-600" bgColor="bg-green-50" icon={TrendingUp} {...listSectionProps} />}
                {activeTab === 'gastos' && <ListSection title="Gastos" items={gastos} setter={setGastos} color="text-red-600" bgColor="bg-red-50" icon={TrendingDown} placeholder="¿Qué pagaste?" {...listSectionProps} />}
                {activeTab === 'metas' && <ListSection title="Metas Ahorro" items={metas} setter={setMetas} color="text-cyan-600" bgColor="bg-cyan-50" icon={Trophy} placeholder="Nombre de la meta" type="meta" {...listSectionProps} />}
                {activeTab === 'inversiones' && <ListSection title="Inversiones" items={inversiones} setter={setInversiones} color="text-indigo-600" bgColor="bg-indigo-50" icon={Rocket} placeholder="¿En qué inviertes?" type="inversion" {...listSectionProps} />}
                {activeTab === 'presupuesto' && <ListSection title="Fijos" items={presupuesto} setter={setPresupuesto} color="text-orange-600" bgColor="bg-orange-50" icon={Target} placeholder="Pago obligatorio" {...listSectionProps} />}
                {activeTab === 'proyectado' && <ListSection title="Deseos" items={proyectado} setter={setProyectado} color="text-purple-600" bgColor="bg-purple-50" icon={Wallet} placeholder="Gasto opcional" {...listSectionProps} />}
                {activeTab === 'resumen' && <SmartTotals periodo={periodo} bolsa={bolsa} totalIngresos={totalIngresos} totalGastos={totalGastos} totalPatrimonio={totalPatrimonio} obligacionesPendientes={obligacionesPendientes} situacionReal={situacionReal} formatCurrency={formatCurrency} />}
            </main>
        </div>
    );
}
