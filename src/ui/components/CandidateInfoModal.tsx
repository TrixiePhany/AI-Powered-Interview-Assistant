import { useState } from "react";
import { useDispatch } from "react-redux";
import { setIdentity } from "../../features/session/sessionSlice";

type Props = {
  initial?: {
    name?: string;
    email?: string;
    phone?: string;
    internship?: string;
    address?: string;
    gender?: string;
  };
  onClose: () => void;
};

export default function CandidateInfoModal({ initial, onClose }: Props) {
  const dispatch = useDispatch();
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [internship, setInternship] = useState(initial?.internship || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [gender, setGender] = useState(initial?.gender || "");

  const handleSubmit = () => {
    if (!name || !email || !phone || !address || !gender) {
      alert("Please fill all required fields.");
      return;
    }
    dispatch(
      setIdentity({
        name,
        email,
        phone,
        internship,
        address,
        gender,
      } as any)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Candidate Information
        </h2>
        <p className="text-sm text-gray-500 pb-5 text-center">
          You can edit your details below to start the interview
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select your gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Location <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Internship Details */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Internship Details (If any)
            </label>
            <textarea
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              rows={3}
              placeholder="e.g., Full Stack Internship at XYZ"
              value={internship}
              onChange={(e) => setInternship(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
