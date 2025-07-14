module.exports = (query) => {
  const filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Không hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  // Validation: check if query.status is valid
  const validStatuses = ["", "active", "inactive"];
  const statusToCheck = query.status || "";

  if (!validStatuses.includes(statusToCheck)) {
    // If invalid status, default to "all"
    const index = filterStatus.findIndex((item) => item.status === "");
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex(
      (item) => item.status === statusToCheck
    );
    if (index !== -1) {
      filterStatus[index].class = "active";
    }
  }

  return filterStatus;
};
