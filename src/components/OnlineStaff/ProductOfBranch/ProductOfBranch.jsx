import React, { useEffect, useState } from "react";
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { fetchProductsbyBranch } from "../../../services/warehouseService";
import { fetchBranchs } from "../../../services/branchService";

const ProductOfBranch = ({ selectedBranchId, setSelectedBranchId, productIds, orderId, selectedProducts }) => {
    const [branches, setBranches] = useState([]);
    const [branchStatus, setBranchStatus] = useState({});
    const [check, setCheck] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBranchesWithStatus = async () => {
            setIsLoading(true);
            try {
                const branchData = await fetchBranchs();
                setBranches(branchData);

                const statusPromises = branchData.map(async (branch) => {
                    const products = await fetchProductsbyBranch(branch.id);
                    const unavailableProducts = selectedProducts
                        .map((selectedProduct) => {
                            const branchProduct = products.find(
                                (p) => Number(p.productId) === Number(selectedProduct.productId || selectedProduct.id)
                            );

                            if (!branchProduct) {
                                return {
                                    productName: selectedProduct.productName,
                                    productId: selectedProduct.id,
                                    availableQuantity: 0,
                                };
                            }

                            if (
                                branchProduct.availableQuantity != null &&
                                selectedProduct.quantity > branchProduct.availableQuantity
                            ) {
                                return {
                                    productName: selectedProduct.productName,
                                    productId: selectedProduct.id,
                                    availableQuantity: branchProduct.availableQuantity,
                                };
                            }

                            return null;
                        })
                        .filter((product) => product !== null);

                    const isAvailable = unavailableProducts.length === 0;
                    setCheck(unavailableProducts);
                    return {
                        branchId: branch.id,
                        status: isAvailable
                            ? "Còn hàng"
                            : `Hết hàng: ${unavailableProducts
                                .map((p) => `${p.productName} (Số lượng còn: ${p.availableQuantity})`)
                                .join(", ")}`,
                    };
                });

                const statuses = await Promise.all(statusPromises);
                const statusMap = {};
                statuses.forEach(({ branchId, status }) => {
                    statusMap[branchId] = status;
                });
                setBranchStatus(statusMap);
            } catch (error) {
                console.error("Error loading branches or availability:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadBranchesWithStatus();
    }, [productIds, selectedProducts, selectedBranchId]);

    const handleBranchChange = (branchId) => {
        setSelectedBranchId(branchId);
        setIsLoading(false);
    };

    return (
        <div className="mt-4 text-sm text-black bg-gray-300 p-2 rounded">
            {(isLoading && selectedBranchId ===null) ? (
                <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
                </div>
            ) : (
                <Card className="w-full">
                    <List>
                        {branches.map((branch) => (
                            <ListItem
                                disabled={branchStatus[branch.id] !== "Còn hàng"}
                                key={branch.id}
                                className={`cursor-pointer hover:bg-gray-100 ${branchStatus[branch.id] === "Hết hàng" ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={() => branchStatus[branch.id] !== "Hết hàng" && handleBranchChange(branch.id)}
                            >
                                <input
                                    type="radio"
                                    name="branch"
                                    value={branch.id}
                                    checked={selectedBranchId === branch.id}
                                    onChange={() => handleBranchChange(branch.id)}
                                    className="mr-2"
                                    disabled={branchStatus[branch.id] !== "Còn hàng"}
                                />
                                <ListItemPrefix>
                                    <Avatar
                                        variant="circular"
                                        alt={branch.branchName}
                                        src={branch.imgAvatarPath}
                                    />
                                </ListItemPrefix>
                                <div>
                                    <Typography variant="h6">{branch.branchName} - {branch.hotline}</Typography>
                                    <Typography variant="small" color="gray">{branch.location}</Typography>
                                    <Typography
                                        variant="small"
                                        color={branchStatus[branch.id] === "Còn hàng" ? "green" : "red"}
                                    >
                                        {branchStatus[branch.id]}
                                    </Typography>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
        </div>
    );
};

export default ProductOfBranch;
