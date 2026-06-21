import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, ShieldAlert, BadgeInfo, CheckCircle, Flame, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { MockDataSchema } from "../types";

interface InteractiveSandboxProps {
  appName: string;
  schema: MockDataSchema;
}

export default function InteractiveSandbox({ appName, schema }: InteractiveSandboxProps) {
  const [items, setItems] = useState<any[]>(schema.items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<any>({});
  const [metrics, setMetrics] = useState<any[]>(schema.metrics || []);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync schema changes (e.g. on new generation)
  useEffect(() => {
    setItems(schema.items || []);
    setMetrics(schema.metrics || []);
    setNewItem({});
  }, [schema]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) => {
    return Object.values(item).some((val) => {
      if (typeof val === "string" || typeof val === "number") {
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  const handleDelete = (id: string | number) => {
    const deletedItem = items.find((itm) => itm.id === id);
    const updated = items.filter((itm) => itm.id !== id);
    setItems(updated);
    
    // Update metric counters if primary quantity changes
    if (metrics[0]) {
      const firstMetric = { ...metrics[0] };
      const currentNum = parseInt(firstMetric.value.replace(/,/g, ""));
      if (!isNaN(currentNum)) {
        firstMetric.value = (currentNum - 1).toLocaleString();
        setMetrics([firstMetric, ...metrics.slice(1)]);
      }
    }

    showNotification(`Deleted item successfully.`);
  };

  const handleOpenAddModal = () => {
    // Scaffold initial input fields based on schema headers
    const initialForm: any = {};
    schema.headers.forEach((hdr) => {
      if (hdr.toLowerCase() === "id") {
        initialForm[hdr] = items.length + 101;
      } else {
        initialForm[hdr] = "";
      }
    });
    setNewItem(initialForm);
    setIsModalOpen(true);
  };

  const handleInputChange = (header: string, val: string) => {
    setNewItem((prev: any) => ({
      ...prev,
      [header]: val,
    }));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    setItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);

    // Dynamic metrics count increment
    if (metrics[0]) {
      const firstMetric = { ...metrics[0] };
      const currentNum = parseInt(firstMetric.value.replace(/,/g, ""));
      if (!isNaN(currentNum)) {
        firstMetric.value = (currentNum + 1).toLocaleString();
        setMetrics([firstMetric, ...metrics.slice(1)]);
      }
    }

    showNotification(`Added new ${schema.primaryEntitySingular} successfully.`);
  };

  const capitalize = (str: string) => {
    if (!str) return "";
    return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-6 relative shadow-xs">
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-lg shadow-xl text-xs transition duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Embedded Sandbox App Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 leading-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-[#5A5A40] font-mono text-[10px] font-bold uppercase tracking-widest leading-none">LIVE MOCK SANDBOX</span>
          </div>
          <h2 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2 mt-1">
            <span>{appName}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/15 inline-flex items-center justify-center">V1.0</span>
          </h2>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-[#5A5A40]/10 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add {schema.primaryEntitySingular}</span>
        </button>
      </div>

      {/* Metrics Indicators Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1 hover:border-stone-300 transition">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{metric.label}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-display font-bold text-stone-800 leading-none">{metric.value}</span>
              {metric.change && (
                <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none border shrink-0 ${
                  metric.isPositive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                    : "bg-rose-50 text-rose-600 border-rose-200/50"
                }`}>
                  {metric.isPositive ? <TrendingUp className="w-3 h-3 shrink-0 text-emerald-600" /> : <TrendingDown className="w-3 h-3 shrink-0 text-rose-600" />}
                  <span>{metric.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Filter Operations */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={`Search ${schema.primaryEntityPlural.toLowerCase()}...`}
            className="w-full bg-stone-50 border border-stone-200 focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]/30 rounded-lg py-2 pl-9 pr-4 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Dynamic Data Grid */}
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider select-none">
              {schema.headers.map((header) => (
                <th key={header} className="p-3 text-[10px]">
                  {capitalize(header)}
                </th>
              ))}
              <th className="p-2 text-center text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-650">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={schema.headers.length + 1} className="p-8 text-center text-stone-400 bg-stone-50/50">
                  <BadgeInfo className="w-7 h-7 mx-auto text-stone-300 mb-2" />
                  No {schema.primaryEntityPlural.toLowerCase()} logged. Add one or adjust your criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, rowIdx) => (
                <tr key={item.id || rowIdx} className="hover:bg-stone-50/50 transition">
                  {schema.headers.map((header) => {
                    const rawVal = item[header];
                    const val = typeof rawVal === "boolean" ? (rawVal ? "Yes" : "No") : rawVal;

                    if (header.toLowerCase() === "status") {
                      let statusBg = "bg-stone-100 text-stone-700";
                      const lowerStatus = String(val).toLowerCase();
                      if (lowerStatus.includes("completed") || lowerStatus.includes("active") || lowerStatus.includes("healthy") || lowerStatus.includes("payout") || lowerStatus.includes("high") || lowerStatus.includes("paid")) {
                        statusBg = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                      } else if (lowerStatus.includes("progress") || lowerStatus.includes("pending") || lowerStatus.includes("booking") || lowerStatus.includes("medium")) {
                        statusBg = "bg-amber-50 text-amber-750 border border-amber-100";
                      } else {
                        statusBg = "bg-rose-50 text-rose-700 border border-rose-100";
                      }
                      
                      return (
                        <td key={header} className="p-3">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusBg}`}>
                            {val}
                          </span>
                        </td>
                      );
                    }

                    if (header.toLowerCase() === "priority") {
                      const lowerPri = String(val).toLowerCase();
                      const style = lowerPri.includes("high") ? "text-rose-600 font-semibold" : lowerPri.includes("med") ? "text-amber-600 font-semibold" : "text-stone-500";
                      return (
                        <td key={header} className={`p-3 text-[11px] ${style}`}>
                          {val}
                        </td>
                      );
                    }

                    return (
                      <td key={header} className="p-3 text-stone-800 font-medium">
                        {val}
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 px-2 text-stone-400 hover:text-rose-650 hover:bg-rose-50 rounded transition cursor-pointer"
                      title={`Remove records`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-sm border border-stone-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-display font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                Add New {schema.primaryEntitySingular}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 gap-3.5 max-h-72 overflow-y-auto pr-1">
                {schema.headers.map((header) => {
                  if (header.toLowerCase() === "id") return null; // auto-generated
                  
                  return (
                    <div key={header} className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                        {capitalize(header)}
                      </label>
                      <input
                        type="text"
                        required
                        value={newItem[header] || ""}
                        onChange={(e) => handleInputChange(header, e.target.value)}
                        placeholder={`Enter ${header}...`}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]/30 rounded-lg px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-all"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
