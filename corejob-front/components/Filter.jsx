"use client";

import { useEffect, useRef, useState } from "react";
import { PERU_DEPARTMENTS } from "@/constants/peruLocations";
import { fetchJSON } from "@/lib/api";

const Filter = ({ onApplyFilters }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 240,
  });

  const contentRef = useRef(null);
  const categoryTriggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setMaxHeight(contentRef.current.scrollHeight + 10);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError("");
      try {
        const data = await fetchJSON("/categories", { suppressRedirect: true });
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategoriesError(
          err.message || "No se pudieron cargar las categorías."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("searchFiltersCollapsed");
      if (stored === "true" || stored === "false") {
        setCollapsed(stored === "true");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (collapsed) {
      setShowCategories(false);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!showCategories) return;

    const updatePosition = () => {
      if (!categoryTriggerRef.current) return;
      const rect = categoryTriggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    const handleClickOutside = (event) => {
      const trigger = categoryTriggerRef.current;
      const dropdown = dropdownRef.current;

      if (
        trigger &&
        dropdown &&
        !trigger.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        setShowCategories(false);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories]);

  const handleApply = () => {
    if (typeof onApplyFilters === "function") {
      onApplyFilters({
        categoryIds: Array.from(selectedCategories),
        country: country || "",
        department: department || "",
        maxPrice: maxPrice.trim(),
        minRating: minRating ? Number(minRating) : null,
        maxDistanceKm: maxDistanceKm > 0 ? maxDistanceKm : null,
      });
    }
  };

  return (
    <>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: collapsed ? 0 : maxHeight }}
      >
        <div
          ref={contentRef}
          className="border border-[#065f46] text-white text-sm flex flex-wrap gap-2 p-4 rounded-md w-fit mx-auto bg-[#031e1a]"
        >
          <div className="relative">
            <button
              type="button"
              ref={categoryTriggerRef}
              className="bg-[#065f46] w-full min-w-[170px] p-2 rounded-md flex items-center justify-between gap-2"
              onClick={() =>
                setShowCategories((prev) => {
                  const next = !prev;
                  if (!next) return next;
                  if (categoryTriggerRef.current) {
                    const rect =
                      categoryTriggerRef.current.getBoundingClientRect();
                    setDropdownStyle({
                      top: rect.bottom + 8,
                      left: rect.left,
                      width: rect.width || 240,
                    });
                  }
                  return next;
                })
              }
            >
              <span>
                Categorías
                {selectedCategories.size ? ` (${selectedCategories.size})` : ""}
              </span>
              <i
                className={`fa-solid fa-angle-down text-xs transition ${
                  showCategories ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {showCategories && (
              <div
                className="fixed z-50 rounded-lg border border-[#0c4e3b] bg-[#05221c] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
                ref={dropdownRef}
                style={{
                  top: dropdownStyle.top,
                  left: dropdownStyle.left,
                }}
              >
                <p className="mb-3 text-xs uppercase">Selecciona categorías</p>
                {loadingCategories ? (
                  <p className="text-xs text-slate-300">Cargando categorías...</p>
                ) : categoriesError ? (
                  <p className="text-xs text-red-300">{categoriesError}</p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-slate-300">
                    No hay categorías disponibles por el momento.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {categories.map((category) => {
                      const id = String(category._id);
                      const checked = selectedCategories.has(id);
                      return (
                        <label
                          key={id}
                          className="flex items-center gap-3 rounded-xl bg-[#0a2f26] px-3 py-2 text-xs text-white"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-[#0c9f72]"
                            checked={checked}
                            onChange={() => {
                              setSelectedCategories((prev) => {
                                const next = new Set(prev);
                                if (next.has(id)) {
                                  next.delete(id);
                                } else {
                                  next.add(id);
                                }
                                return next;
                              });
                            }}
                          />
                          <span>{category.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <select
            className="bg-[#065f46] rounded-md p-1"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          >
            <option value="">País</option>
            <option value="Perú">Perú</option>
          </select>

          <select
            className="bg-[#065f46] rounded-md p-1"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option value="">Provincia</option>
            {PERU_DEPARTMENTS.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            className="bg-[#065f46] rounded-md p-1 w-44 [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Precio máximo S/"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />

          <div className="flex flex-col gap-1 text-xs text-emerald-50">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-[0.75rem]" />
              Radio máximo
              {maxDistanceKm > 0 ? `: ${maxDistanceKm} km` : " (opcional)"}
            </span>
            <input
              type="range"
              min="1"
              max="50"
              value={maxDistanceKm || 0}
              onChange={(event) =>
                setMaxDistanceKm(Number(event.target.value) || 0)
              }
              className="w-44 accent-emerald-500"
            />
          </div>

          <select
            className="bg-[#065f46] rounded-md p-1"
            value={minRating || ""}
            onChange={(event) => setMinRating(event.target.value)}
          >
            <option value="">Valoración ⭐️ (todas)</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️ y superior</option>
            <option value="4">⭐️⭐️⭐️⭐️ y superior</option>
            <option value="3">⭐️⭐️⭐️ y superior</option>
            <option value="2">⭐️⭐️ y superior</option>
            <option value="1">⭐️ y superior</option>
          </select>

          <button
            type="button"
            onClick={handleApply}
            className="border text-emerald-600 py-1 px-3 rounded-md hover:text-white hover:border-[#065f46] hover:bg-[#065f46] duration-200"
          >
            Buscar
          </button>
          <button
            type="button"
            className="border text-emerald-600 py-1 px-3 rounded-md hover:text-white hover:border-[#065f46] hover:bg-[#065f46] duration-200"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
      <div className="boton-ocultar-mostrar">
        <div
          className={`border border-[#065f46] w-fit mx-auto px-5 rounded-b-md ${
            collapsed && "rounded-t-md"
          }  bg-[#065f46] cursor-pointer flex items-center gap-x-2`}
          onClick={() =>
            setCollapsed((prev) => {
              const next = !prev;
              try {
                window.localStorage.setItem(
                  "searchFiltersCollapsed",
                  String(next)
                );
              } catch {
                // ignore storage errors
              }
              return next;
            })
          }
        >
          <i className="fa-solid fa-arrow-up-wide-short text-xs"></i>
          <p>{`${collapsed ? "Mostrar" : "Ocultar"} filtros`}</p>
        </div>
      </div>
    </>
  );
};

export default Filter;
