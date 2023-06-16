import BackButton from "../../component/button/backbutton/BackButton";
import Error from "../../component/pop_up/Error";

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  queryEveryDaily,
  queryEveryCT_BCDSByMaBCDS,
  queryEveryBaocaodoanhso,
} from "../../graphql/queries";
import {
  addBaocaodoanhsoMutation,
  addCt_bcdsMutation,
  calculateTyle,
} from "../../graphql/mutations";
import { useState } from "react";

function BaoCaoDoanhThu() {
  const [date, setDate] = useState("");
  const [tableData, setTableData] = useState(null);
  const [showError, setShowError] = useState(null);

  const { loading: evDaiLyLoading, error, data } = useQuery(queryEveryDaily);
  const [queryEvCT_BCDSFunc, { loading: evBCDSByMaBCDSLoading }] = useLazyQuery(
    queryEveryCT_BCDSByMaBCDS
  );
  const [queryEvBCDSFunc, { loading: evBCDSLoading }] = useLazyQuery(queryEveryBaocaodoanhso);
  const [addBCDSFunc, { loading: addBCDSByLoading }] = useMutation(addBaocaodoanhsoMutation);
  const [addCT_BCDSFunc, { loading: addCT_CDSLoading }] = useMutation(addCt_bcdsMutation);
  const [calculate, { loading: calculateTyLeLoading }] = useMutation(calculateTyle);

  if (evDaiLyLoading) return <div>Loading...</div>;
  if (error) setShowError(error);

  const handleDateChange = (event) => {
    setShowError(null);
    setDate(event.target.value);
  };

  const getCT_BCDSById = async (msBCDS) => {
    try {
      const res = await queryEvCT_BCDSFunc({
        variables: {
          maBaoCaoDoanhSo: msBCDS,
        },
      });

      const listCT_BCDS = res.data?.everyCT_BCDSByMaBCDS;

      if (res.data) setTableData(listCT_BCDS);
      else throw Error("Lỗi khi tính công nợ.")

    } catch (err) {
      setShowError(err);
    }
  };

  const ifNotCreated = async (date) => {
    const listDaiLy = data?.everyDaily;

    try {
      const BCDS = await addBCDSFunc({
        variables: {
          thang: date,
        },
      });

      const maBCDS = BCDS.data?.addBaocaodoanhso?.MaBaoCaoDoanhSo;

      if (!data) throw Error("Lỗi khi tải dữ liệu!");

      await Promise.all(
        listDaiLy.map((daily) =>
          addCT_BCDSFunc({
            variables: {
              maBaoCaoDoanhSo: maBCDS,
              maDaiLy: daily.MaDaiLy,
            },
          })
        )
      );

      await calculate({
        variables: {
          maBaoCaoDoanhSo: maBCDS
        }
      });

      return maBCDS
    } catch (err) {
      setShowError(err);
    }
  };

  const checkIsCreated = async (date) => {
    const msBCDSCreated = await queryEvBCDSFunc();
    const listMS = msBCDSCreated.data?.everyBaocaodoanhso;

    return listMS.find((bcds) => bcds?.Thang == date)?.MaBaoCaoDoanhSo;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const date_ = [date.split("-")[0], date.split("-")[1]].join("-");
    const msBCDS = await checkIsCreated(date_);

    if (msBCDS) getCT_BCDSById(msBCDS);
    else {
      const maBCDS = await ifNotCreated(date_)
      getCT_BCDSById(maBCDS)
    };
  };

  const CreateRow = ({ rowData }) => {
    return (
      <tr>
        <td className="border border-gray-300 px-4 py-2">
          {rowData?.relatedDaily?.TenDaiLy}
        </td>
        <td className="border border-gray-300 px-4 py-2">
          {rowData?.SoPhieuXuat}
        </td>
        <td className="border border-gray-300 px-4 py-2">
          {rowData?.TongTriGia}
        </td>
        <td className="border border-gray-300 px-4 py-2">{rowData?.TyLe}</td>
      </tr>
    );
  };

  const isLoading = evBCDSByMaBCDSLoading || evBCDSLoading || addBCDSByLoading || addCT_CDSLoading || calculateTyLeLoading;

  const createTable = (date, tableData) => {
    let data = [...tableData]
    data.sort((a, b) => b.TongTriGia - a.TongTriGia)

    return (
      <div className="mt-4 mx-auto">
        <h2 className="text-center text-xl mb-2">
          Báo cáo doanh thu tháng {date.split("-")[1]} năm {date.split("-")[0]}
        </h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Tên đại lý</th>
              <th className="border border-gray-300 px-4 py-2">Số phiếu xuất</th>
              <th className="border border-gray-300 px-4 py-2">Tổng trị giá</th>
              <th className="border border-gray-300 px-4 py-2">Tỷ lệ (%)</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((row) => (
                <CreateRow rowData={row} key={row?.MaCT_BCDS} />
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 font-bold text-right"
                colSpan="4"
              >
                Tổng số doanh thu:{" "}
                {tableData.reduce(
                  (total, x) => total + parseFloat(x?.["TongTriGia"]),
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  };

  return (
    <div>
      {showError && <Error error={showError} />}
      {/* Heading */}
      <div className="mb-10 flex justify-center items-center">
        <BackButton className="mr-4" />
        <h2 className="ml-10 text-4xl font-bold text-left w-full">
          Báo cáo doanh thu
        </h2>
      </div>
      {/* Form */}
      <div>
        <form className="flex gap-4" onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            required
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo báo cáo..." : "Tạo báo cáo"}
          </button>
        </form>
      </div>
      {tableData && createTable(date, tableData)}
    </div>
  );
}

export default BaoCaoDoanhThu;
