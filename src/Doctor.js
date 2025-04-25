// doctor-listing-page.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

const SPECIALTIES = [
  "General Physician", "Dentist", "Dermatologist", "Paediatrician",
  "Gynaecologist", "ENT", "Diabetologist", "Cardiologist", "Physiotherapist",
  "Endocrinologist", "Orthopaedic", "Ophthalmologist", "Gastroenterologist",
  "Pulmonologist", "Psychiatrist", "Urologist", "Dietitian/Nutritionist",
  "Psychologist", "Sexologist", "Nephrologist", "Neurologist", "Oncologist",
  "Ayurveda", "Homeopath"
];

export default function DoctorListingPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const moc = searchParams.get("moc") || "";
  const specialties = searchParams.get("specialties")?.split(",") || [];
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    axios.get(API_URL).then(res => setDoctors(res.data));
  }, []);

  useEffect(() => {
    let result = [...doctors];
    if (search) {
      result = result.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (moc) {
      result = result.filter(d => d.mode_of_consultation === moc);
    }
    if (specialties.length > 0) {
      result = result.filter(d => specialties.some(s => d.specialities.includes(s)));
    }
    if (sort === "fees") {
      result.sort((a, b) => a.fees - b.fees);
    } else if (sort === "experience") {
      result.sort((a, b) => b.experience - a.experience);
    }
    setFilteredDoctors(result);
  }, [doctors, moc, specialties, sort, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    const matches = doctors.filter(d => d.name.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(matches.slice(0, 3));
  };

  const applySearch = (text) => {
    setSearchParams(params => {
      params.set("search", text);
      return params;
    });
    setSuggestions([]);
    setQuery(text);
  };

  const toggleSpecialty = (specialty) => {
    let updated = [...specialties];
    if (updated.includes(specialty)) {
      updated = updated.filter(s => s !== specialty);
    } else {
      updated.push(specialty);
    }
    setSearchParams(params => {
      params.set("specialties", updated.join(","));
      return params;
    });
  };

  const applyMOC = (mode) => {
    setSearchParams(params => {
      params.set("moc", mode);
      return params;
    });
  };

  const applySort = (criteria) => {
    setSearchParams(params => {
      params.set("sort", criteria);
      return params;
    });
  };

  return (
    <div className="p-4">
      <input
        data-testid="autocomplete-input"
        value={query}
        onChange={handleSearchChange}
        onKeyDown={(e) => e.key === "Enter" && applySearch(query)}
        placeholder="Search doctor by name"
        className="border p-2 w-full"
      />
      <div className="bg-white border rounded shadow mt-1">
        {suggestions.map((s, i) => (
          <div
            key={i}
            data-testid="suggestion-item"
            onClick={() => applySearch(s.name)}
            className="p-2 cursor-pointer hover:bg-gray-200"
          >{s.name}</div>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="col-span-1">
          <div data-testid="filter-header-moc" className="font-bold mb-1">Consultation Mode</div>
          <label><input data-testid="filter-video-consult" type="radio" name="moc" checked={moc === "Video Consult"} onChange={() => applyMOC("Video Consult")} /> Video Consult</label><br />
          <label><input data-testid="filter-in-clinic" type="radio" name="moc" checked={moc === "In Clinic"} onChange={() => applyMOC("In Clinic")} /> In Clinic</label>

          <div data-testid="filter-header-speciality" className="font-bold mt-4 mb-1">Speciality</div>
          {SPECIALTIES.map(s => (
            <div key={s}>
              <label>
                <input
                  data-testid={`filter-specialty-${s.replaceAll("/", "-")}`}
                  type="checkbox"
                  checked={specialties.includes(s)}
                  onChange={() => toggleSpecialty(s)}
                /> {s}
              </label>
            </div>
          ))}

          <div data-testid="filter-header-sort" className="font-bold mt-4 mb-1">Sort</div>
          <label><input data-testid="sort-fees" type="radio" name="sort" checked={sort === "fees"} onChange={() => applySort("fees")} /> Fees (Low to High)</label><br />
          <label><input data-testid="sort-experience" type="radio" name="sort" checked={sort === "experience"} onChange={() => applySort("experience")} /> Experience (High to Low)</label>
        </div>

        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc, i) => (
              <div key={i} data-testid="doctor-card" className="border p-4 rounded shadow">
                <div data-testid="doctor-name" className="font-bold text-lg">{doc.name}</div>
                <div data-testid="doctor-specialty">{doc.specialities.join(", ")}</div>
                <div data-testid="doctor-experience">Experience: {doc.experience} years</div>
                <div data-testid="doctor-fee">Fees: ₹{doc.fees}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
