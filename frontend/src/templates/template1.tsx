export default function Template1({ data }: any) {
  return (
    <div className="p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-blue-600">{data.name}</h1>
      <p className="text-sm text-gray-600">{data.job_title}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Summary</h3>
        <p>{data.summary}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Experience</h3>
        {data.experience.map((exp:any, idx:number) => (
          <div key={idx} className="mt-2">
            <div className="font-bold">{exp.position}</div>
            <div className="text-sm text-gray-500">{exp.company} — {exp.years}</div>
            <div>{exp.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Skills</h3>
        <div className="flex gap-2 flex-wrap mt-2">
          {data.skills.map((s:any, i:number) => <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{s}</span>)}
        </div>
      </div>
    </div>
  );
}
