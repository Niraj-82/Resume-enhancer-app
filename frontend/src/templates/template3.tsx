export default function Template3({ data }: any) {
  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-white">
      <div className="col-span-1 bg-gray-100 p-4 rounded">
        <h2 className="font-bold">{data.name}</h2>
        <div className="text-sm text-blue-600">{data.job_title}</div>
        <div className="mt-4">
          <h4 className="font-semibold">Skills</h4>
          <ul className="list-disc ml-5">
            {data.skills.map((s:any,i:number)=>(<li key={i}>{s}</li>))}
          </ul>
        </div>
      </div>
      <div className="col-span-2 p-4">
        <h3 className="font-semibold">Summary</h3>
        <p>{data.summary}</p>
        <h3 className="font-semibold mt-4">Experience</h3>
        {data.experience.map((exp:any, idx:number)=>(
          <div key={idx} className="mt-2">
            <div className="font-bold">{exp.position}</div>
            <div className="text-sm text-gray-500">{exp.company} — {exp.years}</div>
            <div>{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
