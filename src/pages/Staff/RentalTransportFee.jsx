import React, { useEffect, useState } from "react";
import { fetchDistrict, fetchProvince, fetchShippingFee, fetchWard } from "../../services/GHN/GHNService";
import { fetchProductByProductCode } from "../../services/productService";
import { fetchBranchDetail } from "../../services/branchService";

const RentalTransportFee = ({ address, product, branchId, setTransportFee }) => {
    // console.log(branchId);
        console.log(address, product, branchId);
    const [provinceID, setProvinceID] = useState("");
    const [districtID, setDistrictID] = useState("");
    const [wardCode, setWardCode] = useState("");
    const [branchProvinceID, setBranchProvinceID] = useState("");
    const [branchDistrictID, setBranchDistrictID] = useState("");
    const [shippingFee, setShippingFee] = useState(0);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState('');

    const handleBranch = async () => {
        const data = await fetchBranchDetail(branchId);
        const branchParts = data.location.split(",").map(part => part.trim());
        const BranchProvinceName = branchParts[branchParts.length - 1];
        const BranchDistrictName = branchParts[branchParts.length - 2];

        try {
            const result = await fetchProvince();
            if (result.code === 200 && result.data) {
                const matchingProvince = result.data.find((province) =>
                    province.NameExtension.includes(BranchProvinceName)
                );
                setBranchProvinceID(matchingProvince.ProvinceID);

                const districtResult = await fetchDistrict(matchingProvince.ProvinceID);
                if (districtResult.code === 200 && districtResult.data) {
                    const matchingDistrict = districtResult.data.find((district) =>
                        district.NameExtension.includes(BranchDistrictName)
                    );
                    setBranchDistrictID(matchingDistrict.DistrictID);
                }

            } else {
                console.error("Failed to fetch province data:", result.message);
            }
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    const handleAddress = async () => {
        const addressParts = address.split(",").map(part => part.trim());
        const ProvinceName = addressParts[addressParts.length - 1];
        const DistrictName = addressParts[addressParts.length - 2];
        const WardName = addressParts[addressParts.length - 3];

        try {
            const result = await fetchProvince();
            if (result.code === 200 && result.data) {
                const matchingProvince = result.data.find(
                    (province) => province.ProvinceName === ProvinceName
                );
                setProvinceID(matchingProvince.ProvinceID);
                const districtResult = await fetchDistrict(matchingProvince.ProvinceID);
                if (districtResult.code === 200 && districtResult.data) {
                    const matchingDistrict = districtResult.data.find(
                        (district) => district.DistrictName === DistrictName
                    );
                    setDistrictID(matchingDistrict.DistrictID);
                    const wardResult = await fetchWard(matchingDistrict.DistrictID);
                    if (wardResult.code === 200 && wardResult.data) {
                        const matchingWard = wardResult.data.find(
                            (ward) => ward.WardName === WardName
                        );
                        setWardCode(matchingWard.WardCode);
                    }
                }

            } else {
                console.error("Failed to fetch province data:", result.message);
            }
        } catch (error) {
            console.error("Error fetching API:", error);
        }
    };

    const handleProduct = async () => {
        try {
            const { productCode, color, size, condition } = product;

            // Call the API to fetch the result
            const response = await fetchProductByProductCode(
                productCode,
                color,
                size,
                condition
            );

            // Assume response[0] contains the product data
            const productData = response[0];
            // console.log("Product data:", productData);

            const productDetails = {
                height: productData.height,
                weight: productData.weight,
                width: productData.width,
                length: productData.length
            };

            // console.log("Product Details:", productDetails);
            setProducts(productDetails);
        } catch (error) {
            console.error("Error while fetching product:", error);
        }
    };

    const handleTransportFee = async () => {
        console.log(products);
        let totalHeight = 0;
        let totalWeight = 0;
        let maxLength = 0;
        let maxWidth = 0;
        
        if (Array.isArray(products)) {
            if (products.length === 1) {
                // If there is only 1 product, take its values directly
                totalHeight = Math.ceil(products[0].height / 10); // Convert to cm
                totalWeight = products[0].weight; // Weight remains the same
                maxLength = Math.ceil(products[0].length / 10); // Convert to cm
                maxWidth = Math.ceil(products[0].width / 10); // Convert to cm
            } else if (products.length > 1) {
                // If there are multiple products, calculate
                products.forEach((product) => {
                    totalHeight += product.height; // Sum of heights in mm
                    totalWeight += product.weight; // Sum of weights
                    maxLength = Math.max(maxLength, product.length); // Max length in mm
                    maxWidth = Math.max(maxWidth, product.width); // Max width in mm
                });
        
                // Convert to cm after all calculations
                totalHeight = Math.ceil(totalHeight / 10);
                maxLength = Math.ceil(maxLength / 10);
                maxWidth = Math.ceil(maxWidth / 10);
            }
        } else if (typeof products === 'object') {
            // If products is an object (like a single product), use its values directly
            totalHeight = Math.ceil(products.height / 10); // Convert to cm
            totalWeight = products.weight; // Weight remains the same
            maxLength = Math.ceil(products.length / 10); // Convert to cm
            maxWidth = Math.ceil(products.width / 10); // Convert to cm
        }
        

        const data = {
            service_type_id: 2,
            insurance_value: 0,
            coupon: null,
            from_district_id: branchDistrictID,
            to_district_id: districtID,
            to_ward_code: wardCode,
            height: totalHeight,
            length: maxLength,
            weight: totalWeight,
            width: maxWidth,
        };

        console.log("Payload data:", data);
        try {
            setLoading(true);
            const shipFee = await fetchShippingFee(data);
            // console.log(shipFee);
            setShippingFee(shipFee.total);
            setTransportFee(shipFee.total);
        } catch (error) {
            console.error("Error while fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleBranch();
        handleAddress();
        handleProduct();
    }, [address, product, branchId]);

    useEffect(() => {
        if (branchDistrictID && districtID && wardCode && products.length > 0) {
            handleTransportFee();
        }
    }, [branchDistrictID, districtID, wardCode, products]);

    return (
        <div>
            {loading ? (
                <p>Đang tính toán</p>
            ) : (
                <p className="text-orange-500 font-bold">{shippingFee > 0 ? `${shippingFee.toLocaleString('vi-VN')} ₫` : "Chờ tính toán "}</p>
            )}
        </div>
    );
};

export default RentalTransportFee;
