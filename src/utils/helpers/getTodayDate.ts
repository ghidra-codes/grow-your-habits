const getTodayDate = () => new Date().toISOString().split("T")[0];

export default getTodayDate;
