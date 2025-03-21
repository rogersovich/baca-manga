export const getBgStatusClass = (status: any) => {
  switch (status) {
    case "Finished":
      return "bg-green-500";
    case "Discontinued":
      return "bg-red-500";
    case "On Hiatus":
      return "bg-purple-500";
    case "Publishing":
      return "bg-blue-500";
    case "Not yet published":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};
