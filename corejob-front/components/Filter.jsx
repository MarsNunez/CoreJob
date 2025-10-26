"use client";

import { useEffect, useRef, useState } from "react";

const categoryOptions = [
  "Limpieza del hogar",
  "Electricistas",
  "Clases y tutorías",
  "Cuidado de mascotas",
  "Jardinería",
  "Belleza y spa",
  "Delivery y envíos",
  "Soporte tecnológico",
];

const Filter = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    new Set(["Limpieza del hogar"])
  );
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
                <div className="grid md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {categoryOptions.map((category) => {
                    const checked = selectedCategories.has(category);
                    return (
                      <label
                        key={category}
                        className="flex items-center gap-3 rounded-xl bg-[#0a2f26] px-3 py-2 text-xs text-white"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer accent-[#0c9f72]"
                          checked={checked}
                          onChange={() => {
                            setSelectedCategories((prev) => {
                              const next = new Set(prev);
                              if (next.has(category)) {
                                next.delete(category);
                              } else {
                                next.add(category);
                              }
                              return next;
                            });
                          }}
                        />
                        <span>{category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <select className="bg-[#065f46] rounded-md p-1">
            <option value="1">País</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select className="bg-[#065f46] rounded-md p-1">
            <option value="1">Ciudad</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select className="bg-[#065f46] rounded-md p-1">
            <option value="1">Precio minimo $(10)</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select className="bg-[#065f46] rounded-md p-1">
            <option value="1">Precio máximo $(100)</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select className="bg-[#065f46] rounded-md p-1">
            <option value="1">Valoración ⭐️(5)</option>
            <option value="2">⭐️⭐️⭐️⭐️⭐️ y superior</option>
            <option value="3">⭐️⭐️⭐️⭐️ y superior</option>
            <option value="4">⭐️⭐️⭐️ y superior</option>
            <option value="5">⭐️⭐️ y superior</option>
            <option value="6">⭐️ y superior</option>
          </select>

          <button className="border text-emerald-600 py-1 px-3 rounded-md hover:text-white hover:border-[#065f46] hover:bg-[#065f46] duration-200">
            Buscar
          </button>
          <button className="border text-emerald-600 py-1 px-3 rounded-md hover:text-white hover:border-[#065f46] hover:bg-[#065f46] duration-200">
            Limpiar Filtros
          </button>
        </div>
      </div>
      <div className="boton-ocultar-mostrar">
        <div
          className={`border border-[#065f46] w-fit mx-auto px-5 rounded-b-md ${
            collapsed && "rounded-t-md"
          }  bg-[#065f46] cursor-pointer flex items-center gap-x-2`}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <i className="fa-solid fa-arrow-up-wide-short text-xs"></i>
          <p>{`${collapsed ? "Mostrar" : "Ocultar"} filtros`}</p>
        </div>
      </div>
    </>
  );
};

export default Filter;
