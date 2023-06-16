import BackButton from "../../component/button/backbutton/BackButton";
import Error from "../../component/pop_up/Error";
import Success from "../../component/pop_up/Success";
import { queryThamSo } from "../../graphql/queries";
import { updateThamsoMutation } from "../../graphql/mutations";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

function ThayDoiThamSo() {
  const [thamSo, setThamSo] = useState(null);
  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  const { loading, error, data } = useQuery(queryThamSo);
  const [updateFunc] = useMutation(updateThamsoMutation);

  useEffect(() => {
    if (data) setThamSo({ ...data.thamso });
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) setShowError(error);

  const handleTSSLLDL = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      SoLuongLoaiDaiLy: e.target.value,
    }));
  };

  const handleTS_SLLDLTQ = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      SoDaiLyToiDaTrongQuan: e.target.value,
    }));
  };

  const handleTS_SLMH = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      SoLuongMatHang: e.target.value,
    }));
  };

  const handleTS_SLDVT = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      SoLuongDVT: e.target.value,
    }));
  };

  const handleTS_STKVQN = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      SoTienThuKhongVuotQuaSoTienDaiLyDangNo: JSON.parse(e.target.value)
        ? 1
        : 0,
    }));
  };

  const handleTS_TLDGX = (e) => {
    setShowError(null);
    setShowSuccess(null);
    setThamSo((prevState) => ({
      ...prevState,
      TyLeDonGiaXuat: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thamSo) return;

    let thamso = Object.fromEntries(
      Object.entries(thamSo).filter(([key, value]) => value !== "")
    );

    thamso = {
      ...data.thamso,
      ...thamso,
    };

    updateFunc({
      variables: {
        soDaiLyToiDaTrongQuan: parseInt(thamso.SoDaiLyToiDaTrongQuan),
        soLuongDvt: parseInt(thamso.SoLuongDVT),
        soLuongLoaiDaiLy: parseInt(thamso.SoLuongLoaiDaiLy),
        soLuongMatHang: parseInt(thamso.SoLuongMatHang),
        soTienThuKhongVuotQuaSoTienDaiLyDangNo:
          parseInt(thamso.SoTienThuKhongVuotQuaSoTienDaiLyDangNo),
        tyLeDonGiaXuat: parseFloat(thamso.TyLeDonGiaXuat),
      },
    })
      .then((thamsoreturn) => {
        setThamSo(thamsoreturn.data.updateThamso);
        setShowSuccess(true);
      })
      .catch((err) => {
        setShowError(err);
      });
  };

  return (
    <div>
      {showError && <Error error={showError} />}
      {showSuccess && <Success show={showSuccess} />}
      {/* Heading */}
      <div className="flex justify-center items-center mb-5">
        <BackButton className="mr-4" />
        <h2 className="mb-4 text-4xl font-bold text-center w-full">
          Danh sách tham số
        </h2>
      </div>
      {/* Form */}
      <div className="w-1/2 ml-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">Số lượng loại đại lý tối đa:</label>
            <input
              type="number"
              id="max-agents"
              className="border border-gray-300 p-2 flex-grow"
              value={thamSo?.SoLuongLoaiDaiLy || ""}
              placeholder={data?.thamso?.SoLuongLoaiDaiLy}
              onChange={handleTSSLLDL}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">
              Số đại lý tối đa trong một quận:
            </label>
            <input
              type="number"
              id="max-agents"
              className="border border-gray-300 p-2 flex-grow"
              value={thamSo?.SoDaiLyToiDaTrongQuan || ""}
              placeholder={data?.thamso?.SoDaiLyToiDaTrongQuan}
              onChange={handleTS_SLLDLTQ}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">Số lượng mặt hàng:</label>
            <input
              type="number"
              id="max-agents"
              className="border border-gray-300 p-2 flex-grow"
              value={thamSo?.SoLuongMatHang || ""}
              placeholder={data?.thamso?.SoLuongMatHang}
              onChange={handleTS_SLMH}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">Số lượng đơn vị tính:</label>
            <input
              type="number"
              id="max-agents"
              className="border border-gray-300 p-2 flex-grow"
              value={thamSo?.SoLuongDVT || ""}
              placeholder={data?.thamso?.SoLuongDVT}
              onChange={handleTS_SLDVT}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">Không cho phép thu vượt tiền nợ:</label>
            <select
              id="allow-overdue"
              className="border border-gray-300 p-2 flex-grow"
              value={
                thamSo?.SoTienThuKhongVuotQuaSoTienDaiLyDangNo
                  ? "true"
                  : "false"
              }
              placeholder={
                data?.thamso?.SoTienThuKhongVuotQuaSoTienDaiLyDangNo
                  ? "True"
                  : "False"
              }
              onChange={handleTS_STKVQN}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-auto mr-3">Tỷ lệ đơn giá xuất:</label>
            <input
              type="number"
              id="unit-price"
              className="border border-gray-300 p-2 flex-grow"
              value={thamSo?.TyLeDonGiaXuat || ""}
              placeholder={data?.thamso?.TyLeDonGiaXuat}
              onChange={handleTS_TLDGX}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ThayDoiThamSo;
