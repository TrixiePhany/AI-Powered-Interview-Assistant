import { useState } from "react";
import { useDispatch } from "react-redux";
import { setIdentity } from "../../features/session/sessionSlice";

type Props = {
  initial?: { name?: string; email?: string; phone?: string };
  onClose: () => void;
};

export default function CandidateInfoModal({ initial, onClose }: Props) {
  const dispatch = useDispatch();
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [internship, setInternship] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      alert("Please fill all required fields.");
      return;
    }
    dispatch(
      setIdentity({
        name,
        email,
        phone,
        internship, 
      } as any)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-[500px] p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Candidate Information</h2>
        <div className="space-y-3">
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Internship Details"
            value={internship}
            onChange={(e) => setInternship(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
