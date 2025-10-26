import Card from "@/components/Card";
import Filter from "@/components/Filter";

const SearchView = () => {
  return (
    <section className="p-5">
      <Filter />
      <div className="max-w-6xl mx-auto">
        <div className="border w-fit border-[#065f46] my-5 rounded-md px-2 py-1 flex items-center gap-2">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Limpieza" className="outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-6xl mx-auto w-fit">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="text-center pb-10 pt-15 text-lg text-slate-700">
        <p> Eso es todo por ahora (^-^) /</p>
      </div>
    </section>
  );
};

export default SearchView;
