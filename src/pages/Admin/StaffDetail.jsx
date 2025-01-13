import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Spinner } from "@material-tailwind/react";

const StaffDetail = () => {
  const { staffId } = useParams();
  const [staffDetail, setStaffDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaffDetail = async () => {
    try {
      const response = await fetch(
        `https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Staff/get-staff-details?staffId=${staffId}`,
        {
          headers: { accept: "*/*" },
        }
      );
      const result = await response.json();

      if (result.isSuccess) {
        setStaffDetail(result.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetail();
  }, [staffId]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="red" className="text-center p-4">
        {error}
      </Typography>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg p-6">
        <Typography variant="h4" color="blue-gray" className="text-center mb-6">
          Staff Details
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="h6">Name:</Typography>
            <Typography>{staffDetail.userVM.fullName}</Typography>
          </div>
          <div>
            <Typography variant="h6">Email:</Typography>
            <Typography>{staffDetail.userVM.email}</Typography>
          </div>
          <div>
            <Typography variant="h6">Phone:</Typography>
            <Typography>{staffDetail.userVM.phoneNumber}</Typography>
          </div>
          <div>
            <Typography variant="h6">Position:</Typography>
            <Typography>{staffDetail.position}</Typography>
          </div>
          <div>
            <Typography variant="h6">Start Date:</Typography>
            <Typography>
              {new Date(staffDetail.startDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Typography>
          </div>
          <div>
            <Typography variant="h6">Active:</Typography>
            <Typography>
              {staffDetail.isActive ? "Yes" : "No"}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffDetail;
