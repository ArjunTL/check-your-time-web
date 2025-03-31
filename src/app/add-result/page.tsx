"use client";

import { useState, ChangeEvent, useRef } from "react";
import { db, collection, addDoc } from "@/firebaseConfig";


type PrizeWinner = {
  ticket: string;
  location?: string;
};

type Prize = {
  amount: number;
  ticket?: string;
  location?: string;
  numbers?: string[];
  winners?: PrizeWinner[];
};

type FormData = {
  lottery: string;
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  location: string;
  prizes: {
    firstPrize: Prize;
    consolationPrize: Prize;
    secondPrize: Prize;
    thirdPrize: Prize;
    fourthPrize: Prize;
    fifthPrize: Prize;
    sixthPrize: Prize;
    seventhPrize: Prize;
    eighthPrize: Prize;
  };
  issuedBy: string;
  issuerTitle: string;
  nextDrawDate: string;
  nextDrawLocation: string;
};

export default function AddResultPage() {
  const initialFormState: FormData = {
    lottery: "",
    drawNumber: "",
    drawDate: "",
    drawTime: "",
    location: "",
    prizes: {
      firstPrize: { amount: 0, ticket: "", location: "" },
      consolationPrize: { amount: 0, winners: [] },
      secondPrize: { amount: 0, ticket: "", location: "" },
      thirdPrize: { amount: 0, winners: [] },
      fourthPrize: { amount: 0, numbers: [] },
      fifthPrize: { amount: 0, numbers: [] },
      sixthPrize: { amount: 0, numbers: [] },
      seventhPrize: { amount: 0, numbers: [] },
      eighthPrize: { amount: 0, numbers: [] },
    },
    issuedBy: "",
    issuerTitle: "",
    nextDrawDate: "",
    nextDrawLocation: "",
  };

  const [form, setForm] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfError, setPdfError] = useState("");

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdfError("Please upload a valid PDF file");
      return;
    }

    setPdfFile(file);
    setIsExtracting(true);
    setPdfError("");

    try {
      const base64 = await convertToBase64(file);
      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64 }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract data from PDF");
      }

      const data = await response.json();
      setForm((prev) => ({
        ...prev,
        ...data,
        prizes: {
          ...prev.prizes,
          ...data.prizes,
        },
      }));
    } catch (error) {
      console.error("PDF extraction failed:", error);
      setPdfError(
        "Failed to extract data from PDF. Please fill the form manually."
      );
    } finally {
      setIsExtracting(false);
    }
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePrizeChange = (
    prizeCategory: keyof FormData["prizes"],
    field: string,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      prizes: {
        ...prev.prizes,
        [prizeCategory]: {
          ...prev.prizes[prizeCategory],
          [field]: value,
        },
      },
    }));
    setErrors((prev) => ({ ...prev, [`${prizeCategory}_${field}`]: "" }));
  };

  const handlePrizeArrayChange = (
    prizeCategory: keyof FormData["prizes"],
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const currentArray = prev.prizes[prizeCategory].numbers || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        prizes: {
          ...prev.prizes,
          [prizeCategory]: {
            ...prev.prizes[prizeCategory],
            numbers: newArray,
          },
        },
      };
    });
    setErrors((prev) => ({ ...prev, [`${prizeCategory}_${index}`]: "" }));
  };

  const handleAddWinner = (prizeCategory: keyof FormData["prizes"]) => {
    setForm((prev) => ({
      ...prev,
      prizes: {
        ...prev.prizes,
        [prizeCategory]: {
          ...prev.prizes[prizeCategory],
          winners: [
            ...(prev.prizes[prizeCategory].winners || []),
            { ticket: "", location: "" },
          ],
        },
      },
    }));
  };

  const handleRemoveWinner = (
    prizeCategory: keyof FormData["prizes"],
    index: number
  ) => {
    setForm((prev) => {
      // Safely access winners with fallback to empty array
      const currentWinners = prev.prizes[prizeCategory].winners || [];
      const newWinners = [...currentWinners];
      newWinners.splice(index, 1);

      return {
        ...prev,
        prizes: {
          ...prev.prizes,
          [prizeCategory]: {
            ...prev.prizes[prizeCategory],
            winners: newWinners,
          },
        },
      };
    });
  };

  const handleWinnerChange = (
    prizeCategory: keyof FormData["prizes"],
    index: number,
    field: keyof PrizeWinner,
    value: string
  ) => {
    setForm((prev) => {
      const updatedWinners = [...(prev.prizes[prizeCategory].winners || [])];
      updatedWinners[index] = {
        ...updatedWinners[index],
        [field]: value,
      };

      return {
        ...prev,
        prizes: {
          ...prev.prizes,
          [prizeCategory]: {
            ...prev.prizes[prizeCategory],
            winners: updatedWinners,
          },
        },
      };
    });
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.lottery) newErrors.lottery = "Lottery type is required";
    if (!form.drawNumber) newErrors.drawNumber = "Draw number is required";
    if (!form.drawDate) newErrors.drawDate = "Draw date is required";
    if (!form.drawTime) newErrors.drawTime = "Draw time is required";
    if (!form.location) newErrors.location = "Draw location is required";

    Object.keys(form.prizes).forEach((prizeCategory) => {
      const prize = form.prizes[prizeCategory as keyof FormData["prizes"]];
      if (prize.amount <= 0)
        newErrors[`${prizeCategory}_amount`] =
          "Prize amount must be greater than 0";

      if (prize.ticket !== undefined && !prize.ticket.trim()) {
        newErrors[`${prizeCategory}_ticket`] = "Ticket number is required";
      }

      if (prize.location !== undefined && !prize.location.trim()) {
        newErrors[`${prizeCategory}_location`] = "Location is required";
      }

      if (prize.winners) {
        prize.winners.forEach((winner, index) => {
          if (!winner.ticket.trim()) {
            newErrors[`${prizeCategory}_winner_${index}_ticket`] =
              "Ticket number is required";
          }
          if (prizeCategory === "thirdPrize" && !winner.location?.trim()) {
            newErrors[`${prizeCategory}_winner_${index}_location`] =
              "Location is required";
          }
        });
      }

      if (prize.numbers && prize.numbers.some((num) => !num?.trim())) {
        newErrors[`${prizeCategory}_numbers`] = "All numbers must be filled";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const resultData = {
        ...form,
        createdAt: new Date().toISOString(), // Optional: for tracking
      };
  
      await addDoc(collection(db, "lottery_results"), resultData);
      alert("Lottery result saved successfully!");
      setForm(initialFormState); // Optional: reset form after saving
    } catch (err) {
      console.error("Firestore Save Error:", err);
      alert("Failed to save lottery result");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12 bg-white p-6 rounded-lg shadow">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Add Lottery Result
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Enter the details for the lottery draw results.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="lottery"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Lottery Type
              </label>
              <div className="mt-2">
                <input
                  id="lottery"
                  name="lottery"
                  type="text"
                  value={form.lottery}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.lottery && (
                  <p className="text-sm text-red-500">{errors.lottery}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="drawNumber"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Draw Number
              </label>
              <div className="mt-2">
                <input
                  id="drawNumber"
                  name="drawNumber"
                  type="text"
                  placeholder="e.g. W-812"
                  value={form.drawNumber}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.drawNumber && (
                  <p className="text-sm text-red-500">{errors.drawNumber}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="drawDate"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Draw Date
              </label>
              <div className="mt-2">
                <input
                  id="drawDate"
                  name="drawDate"
                  type="date"
                  value={form.drawDate}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.drawDate && (
                  <p className="text-sm text-red-500">{errors.drawDate}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="drawTime"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Draw Time
              </label>
              <div className="mt-2">
                <input
                  id="drawTime"
                  name="drawTime"
                  type="text"
                  value={form.drawTime}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.drawTime && (
                  <p className="text-sm text-red-500">{errors.drawTime}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="location"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Draw Location
              </label>
              <div className="mt-2">
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="pdf-upload"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Upload Result PDF (Auto-fill form)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  id="pdf-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()} // This triggers the file input click
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  disabled={isExtracting}
                >
                  {isExtracting ? "Extracting..." : "Select PDF"}
                </button>
                {pdfError && (
                  <p className="text-sm text-red-500 mt-1">{pdfError}</p>
                )}
                {pdfFile && (
                  <span className="text-sm text-gray-600">
                    {pdfFile.name}
                    {isExtracting && " (processing...)"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prize Sections */}
        {Object.keys(form.prizes).map((prizeCategory) => (
          <div
            key={prizeCategory}
            className="border-b border-gray-900/10 pb-12"
          >
            <h2 className="text-base/7 font-semibold text-gray-900">
              {prizeCategory.replace(/([A-Z])/g, " $1").trim()} - ₹
              {form.prizes[
                prizeCategory as keyof FormData["prizes"]
              ].amount.toLocaleString()}
              /-
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor={`${prizeCategory}_amount`}
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Prize Amount
                </label>
                <div className="mt-2">
                  <input
                    id={`${prizeCategory}_amount`}
                    name={`${prizeCategory}_amount`}
                    type="number"
                    value={
                      form.prizes[prizeCategory as keyof FormData["prizes"]]
                        .amount
                    }
                    onChange={(e) =>
                      handlePrizeChange(
                        prizeCategory as keyof FormData["prizes"],
                        "amount",
                        e.target.value
                      )
                    }
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors[`${prizeCategory}_amount`] && (
                    <p className="text-sm text-red-500">
                      {errors[`${prizeCategory}_amount`]}
                    </p>
                  )}
                </div>
              </div>

              {form.prizes[prizeCategory as keyof FormData["prizes"]].ticket !==
                undefined && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`${prizeCategory}_ticket`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Ticket Number
                  </label>
                  <div className="mt-2">
                    <input
                      id={`${prizeCategory}_ticket`}
                      name={`${prizeCategory}_ticket`}
                      type="text"
                      placeholder="e.g. WJ 209581"
                      value={
                        form.prizes[prizeCategory as keyof FormData["prizes"]]
                          .ticket
                      }
                      onChange={(e) =>
                        handlePrizeChange(
                          prizeCategory as keyof FormData["prizes"],
                          "ticket",
                          e.target.value
                        )
                      }
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors[`${prizeCategory}_ticket`] && (
                      <p className="text-sm text-red-500">
                        {errors[`${prizeCategory}_ticket`]}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {form.prizes[prizeCategory as keyof FormData["prizes"]]
                .location !== undefined && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`${prizeCategory}_location`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      id={`${prizeCategory}_location`}
                      name={`${prizeCategory}_location`}
                      type="text"
                      placeholder="e.g. IDUKKI"
                      value={
                        form.prizes[prizeCategory as keyof FormData["prizes"]]
                          .location
                      }
                      onChange={(e) =>
                        handlePrizeChange(
                          prizeCategory as keyof FormData["prizes"],
                          "location",
                          e.target.value
                        )
                      }
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors[`${prizeCategory}_location`] && (
                      <p className="text-sm text-red-500">
                        {errors[`${prizeCategory}_location`]}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {["consolationPrize", "thirdPrize"].includes(prizeCategory) && (
                <div className="col-span-full">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    {prizeCategory === "consolationPrize"
                      ? "Winning Tickets"
                      : "Winners"}
                  </label>
                  <div className="mt-2 space-y-4">
                    {form.prizes[
                      prizeCategory as keyof FormData["prizes"]
                    ].winners?.map((winner, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12"
                      >
                        <div className="sm:col-span-5">
                          <label
                            htmlFor={`${prizeCategory}_ticket_${index}`}
                            className="block text-sm/6 font-medium text-gray-900"
                          >
                            Ticket {index + 1}
                          </label>
                          <input
                            id={`${prizeCategory}_ticket_${index}`}
                            type="text"
                            placeholder="e.g. WA 209581"
                            value={winner.ticket}
                            onChange={(e) =>
                              handleWinnerChange(
                                prizeCategory as keyof FormData["prizes"],
                                index,
                                "ticket",
                                e.target.value
                              )
                            }
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                          />
                          {errors[
                            `${prizeCategory}_winner_${index}_ticket`
                          ] && (
                            <p className="text-sm text-red-500">
                              {
                                errors[
                                  `${prizeCategory}_winner_${index}_ticket`
                                ]
                              }
                            </p>
                          )}
                        </div>

                        {prizeCategory === "thirdPrize" && (
                          <div className="sm:col-span-5">
                            <label
                              htmlFor={`${prizeCategory}_location_${index}`}
                              className="block text-sm/6 font-medium text-gray-900"
                            >
                              Location
                            </label>
                            <input
                              id={`${prizeCategory}_location_${index}`}
                              type="text"
                              placeholder="e.g. KAYAMKULAM"
                              value={winner.location || ""}
                              onChange={(e) =>
                                handleWinnerChange(
                                  prizeCategory as keyof FormData["prizes"],
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                            {errors[
                              `${prizeCategory}_winner_${index}_location`
                            ] && (
                              <p className="text-sm text-red-500">
                                {
                                  errors[
                                    `${prizeCategory}_winner_${index}_location`
                                  ]
                                }
                              </p>
                            )}
                          </div>
                        )}

                        <div className="sm:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveWinner(
                                prizeCategory as keyof FormData["prizes"],
                                index
                              )
                            }
                            className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddWinner(
                          prizeCategory as keyof FormData["prizes"]
                        )
                      }
                      className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Add{" "}
                      {prizeCategory === "consolationPrize"
                        ? "Ticket"
                        : "Winner"}
                    </button>
                  </div>
                </div>
              )}

              {form.prizes[prizeCategory as keyof FormData["prizes"]]
                .numbers !== undefined && (
                <div className="col-span-full">
                  <label
                    htmlFor={`${prizeCategory}_numbers`}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Winning Numbers (last 4 digits)
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 md:grid-cols-6">
                    {form.prizes[
                      prizeCategory as keyof FormData["prizes"]
                    ].numbers?.map((number, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`${prizeCategory}_number_${index}`}
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Number {index + 1}
                        </label>
                        <div className="mt-1">
                          <input
                            id={`${prizeCategory}_number_${index}`}
                            name={`${prizeCategory}_number_${index}`}
                            type="text"
                            placeholder="e.g. 0327"
                            value={number}
                            onChange={(e) =>
                              handlePrizeArrayChange(
                                prizeCategory as keyof FormData["prizes"],
                                index,
                                e.target.value
                              )
                            }
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const currentNumbers =
                            form.prizes[
                              prizeCategory as keyof FormData["prizes"]
                            ].numbers || [];
                          const newNumbers = [...currentNumbers, ""];
                          setForm((prev) => ({
                            ...prev,
                            prizes: {
                              ...prev.prizes,
                              [prizeCategory]: {
                                ...prev.prizes[
                                  prizeCategory as keyof FormData["prizes"]
                                ],
                                numbers: newNumbers,
                              },
                            },
                          }));
                        }}
                        className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                      >
                        Add Number
                      </button>
                    </div>
                  </div>
                  {errors[`${prizeCategory}_numbers`] && (
                    <p className="text-sm text-red-500">
                      {errors[`${prizeCategory}_numbers`]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Next Draw Information */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Next Draw Information
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="issuedBy"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Issued By
              </label>
              <div className="mt-2">
                <input
                  id="issuedBy"
                  name="issuedBy"
                  type="text"
                  value={form.issuedBy}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="issuerTitle"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="issuerTitle"
                  name="issuerTitle"
                  type="text"
                  value={form.issuerTitle}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="nextDrawDate"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Next Draw Date
              </label>
              <div className="mt-2">
                <input
                  id="nextDrawDate"
                  name="nextDrawDate"
                  type="date"
                  value={form.nextDrawDate}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="nextDrawLocation"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Next Draw Location
              </label>
              <div className="mt-2">
                <input
                  id="nextDrawLocation"
                  name="nextDrawLocation"
                  type="text"
                  value={form.nextDrawLocation}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
