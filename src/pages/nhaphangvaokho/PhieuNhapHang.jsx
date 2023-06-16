import { useQuery, useMutation } from "@apollo/client";
import { queryEveryMathang } from "../../graphql/queries";
import { addPhieunhaphangMutation } from "../../graphql/mutations";
import React, { useState, useEffect } from "react";

import Error from "../../component/pop_up/Error";
import Success from "../../component/pop_up/Success";
import BackButton from "../../component/button/backbutton/BackButton";

function PhieuNhapHang() {
  const { loading, error, data } = useQuery(queryEveryMathang);
  const [addPhieunhaphang, { loading: addPhieuNhapHangLoading, error: addPhieuNhapHangError }] = useMutation(addPhieunhaphangMutation);

  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (data)
      setOptions(
        data.everyMathang.map((item) => ({
          value: item.MaMatHang,
          TenMatHang: item.TenMatHang,
          SoLuongTon: item.SoLuongTon,
        }))
      );
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error || addPhieuNhapHangError) return setShowError(addPhieuNhapHangError || error);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowSuccess(null);
    setShowError(null);

    const form = event.target;
    const maMatHang = form.MaMatHang.value;
    const soLuong = parseInt(form.SoLuong.value);

    try {
      await addPhieunhaphang({
        variables: { MaMatHang: maMatHang, SoLuong: soLuong },
        refetchQueries: () => [{
          query: queryEveryMathang
        }]
      });

      setShowSuccess(true);
    } catch (error) {
      setShowError(error);
    }
  };

  return (
    <div>
      {showError && <Error error={showError} />}
      {showSuccess && <Success show={showSuccess} />}
      <div className="flex justify-center items-center mb-5">
        <BackButton className="mr-4" />
        <h2 className="ml-10 text-4xl font-bold text-left w-full">
          Lập phiếu nhập hàng
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="w-1/3">
        <div className="mb-4">
          <label htmlFor="MaMatHang" className="block">
            Tên mặt hàng:
          </label>
          <select
            name="MaMatHang"
            id="MaMatHang"
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            {options &&
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {`${option.TenMatHang} (Còn lại: ${option.SoLuongTon})`}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="SoLuong" className="block">
            Số lượng:
          </label>
          <input
            type="number"
            name="SoLuong"
            id="SoLuong"
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={addPhieuNhapHangLoading}
        >
          {addPhieuNhapHangLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default PhieuNhapHang;
