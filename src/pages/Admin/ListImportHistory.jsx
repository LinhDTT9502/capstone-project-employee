import React, { useEffect, useState } from "react";
import { fetchImportHistory } from "../../services/Admin/ImportService";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { fetchBranchs } from "../../services/branchService";

const ListImportHistory = () => {
  const [importList, setImportList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState(null);

  const fetchListImport = async () => {
    try {
      const data = await fetchImportHistory();
      setImportList(data);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getListBranch = async () => {
    try {
      const data = await fetchBranchs();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    fetchListImport();
    getListBranch();
  }, []);

  const handleBranchChange = (id) => {
    setNewBranch(id);
};

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-4">
            Lịch sử nhập hàng
          </Typography>
          <p> Chi nhánh 2Sport:</p>
            <div className="flex gap-2 max-w-full overflow-x-auto">

                              {branches.map((branch) => (
                                  <button
                                      key={branch.id}
                                      className={`cursor-pointer ${newBranch === branch.id ? "border-2 border-sky-500 bg-sky-500 text-white font-bold p-2 rounded" : "border-2 border-sky-500  text-sky-500 font-bold p-2 rounded"}`}
                                      onClick={() => handleBranchChange(branch.id)}
                                  >{branch.branchName.split("2Sport ").pop()}</button>
                              ))}
                          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                    #
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                    Product Name
                  </th>
                  {/* <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                    Supplier
                  </th> */}
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                    Import Date
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {importList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.productName}
                    </td>
                    {/* <td className="border border-gray-200 px-4 py-2">
                      {item.supplierName || "Không rõ"}
                    </td> */}
                    <td className="border border-gray-200 px-4 py-2">
                      {new Date(item.importDate).toLocaleString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ListImportHistory;
