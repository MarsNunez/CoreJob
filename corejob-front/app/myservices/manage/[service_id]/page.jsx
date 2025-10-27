"use client";
import { useParams } from "next/navigation";

const ManageServiceView = () => {
  const params = useParams();
  console.log(params.service_id);

  return (
    <section>
      <p>Manage Service</p>
    </section>
  );
};

export default ManageServiceView;
