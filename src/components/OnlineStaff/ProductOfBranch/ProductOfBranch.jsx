import React, { useEffect, useState } from "react";
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { fetchProductsbyBranch } from "../../../services/warehouseService";
import { fetchBranchs } from "../../../services/branchService";

const ProductOfBranch = ({ selectedBranchId, setSelectedBranchId, productIds, orderId }) => {
    const [branches, setBranches] = useState([]);
    const [branchStatus, setBranchStatus] = useState({});

    useEffect(() => {
        const loadBranchesWithStatus = async () => {
            try {
                const branchData = await fetchBranchs();
                setBranches(branchData);

                const statusPromises = branchData.map(async (branch) => {
                    const products = await fetchProductsbyBranch(branch.id);

                    // Check if any product from the order is available in the branch
                    const isAvailable = products.some(
                        (product) => productIds.includes(product.productId) && product.availableQuantity > 0
                    );

                    return { branchId: branch.id, status: isAvailable ? "Còn hàng" : "Hết hàng" };
                });

                const statuses = await Promise.all(statusPromises);

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
    }, [productIds]);

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
                                disabled={branchStatus[branch.id] === "Hết hàng"}
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
