export default function Template2({ data }: any) {
  return (
    <div className="p-6 font-serif text-gray-800">
      <div className="border-b-2 border-blue-500 pb-3">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <div className="text-blue-600">{data.job_title}</div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Summary</h3>
        <p>{data.summary}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Skills</h3>
        <p>{data.skills.join(", ")}</p>
      </div>
    </div>
  );
}
