import React, { useEffect, useState } from "react";
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { fetchProductsbyBranch } from "../../../services/warehouseService";
import { fetchBranchs } from "../../../services/branchService";

const ProductOfBranch = ({ selectedBranchId, setSelectedBranchId, productIds, orderId, selectedProducts }) => {
    const [branches, setBranches] = useState([]);
    const [branchStatus, setBranchStatus] = useState({});
    const [check, setCheck] = useState([]);
    // console.log(selectedProducts);


    useEffect(() => {
        const loadBranchesWithStatus = async () => {
            try {
                const branchData = await fetchBranchs();
                setBranches(branchData);

                const statusPromises = branchData.map(async (branch) => {
                    const products = await fetchProductsbyBranch(branch.id);
                    // Track unavailable products for each branch
                    const unavailableProducts = selectedProducts.map((selectedProduct) => {
                        // Find the branch product by matching selected product id
                        const branchProduct = products.find(
                            (p) => Number(p.productId) === Number(selectedProduct.productId || selectedProduct.id)
                        );
                        // console.log(branchProduct);

                        if (!branchProduct) {
                            // If branchProduct is null, the product is unavailable
                            return {
                                productName: selectedProduct.productName,
                                productId: selectedProduct.id,
                                availableQuantity: 0, // Indicate no stock
                            };
                        }

                        // If the branch product exists and selected product quantity exceeds available quantity
                        if (branchProduct.availableQuantity != null && selectedProduct.quantity > branchProduct.availableQuantity) {
                            return {
                                productName: selectedProduct.productName,
                                productId: selectedProduct.id,
                                availableQuantity: branchProduct.availableQuantity,
                            };
                        }

                        // Otherwise, the product is available
                        return null;
                    }).filter(product => product !== null); // Filter out null values

                    // Determine branch status
                    const isAvailable = unavailableProducts.length === 0;
                    setCheck(unavailableProducts)
                    return {
                        branchId: branch.id,
                        status: isAvailable
                            ? "Còn hàng" // In stock
                            : `Hết hàng: ${unavailableProducts.map(p => `${p.productName} (Số lượng còn: ${p.availableQuantity})`).join(", ")}`, // Out of stock
                    };
                });

                // Wait for all availability checks to complete
                const statuses = await Promise.all(statusPromises);

                // Update branchStatus with the results
                const statusMap = {};
                statuses.forEach(({ branchId, status }) => {
                    statusMap[branchId] = status;
                });
                setBranchStatus(statusMap);
            } catch (error) {
                console.error("Error loading branches or availability:", error);
            }
        };

        loadBranchesWithStatus();
    }, [productIds, selectedProducts]);

    const handleBranchChange = (branchId) => {
        setSelectedBranchId(branchId);
        // console.log("Selected Branch ID:", branchId,orderId);
    };

    return (
        <div className="mt-4 text-sm text-black bg-gray-300 p-2 rounded">
            <Card className="w-full">
                <List>
                    {branches.map((branch) => (
                        <ListItem
                            disabled={branchStatus[branch.id] !== "Còn hàng"}
                            key={branch.id}
                            className={`cursor-pointer hover:bg-gray-100 ${branchStatus[branch.id] === "Hết hàng" ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                <Typography variant="small" color={branchStatus[branch.id] === "Còn hàng" ? "green" : "red"}>
                                    {branchStatus[branch.id]}
                                </Typography>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </div>
    );
};

export default ProductOfBranch;
