"use client";

import { useEffect, useRef, useState } from "react";

const Filter = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const contentRef = useRef(null);

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
          <div className="bg-[#065f46] w-fit p-1 rounded-md">
            Categorias
            <i className="ml-2 fa-solid fa-angle-down text-xs"></i>
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
