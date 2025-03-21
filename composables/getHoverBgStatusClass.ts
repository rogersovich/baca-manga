import clsx from "clsx";

export const getHoverBgStatusClass = (
  status: string,
  type = "group-hover"
): string => {
  return clsx({
    [`${type}:text-green-400`]: status === "Finished",
    [`${type}:text-red-400`]: status === "Discontinued",
    [`${type}:text-purple-400`]: status === "On Hiatus",
    [`${type}:text-blue-400`]: status === "Publishing",
    [`${type}:text-gray-400`]: status === "Not yet published",
  });
};
