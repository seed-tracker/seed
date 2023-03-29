import { Pagination as NextUIPagination } from "@nextui-org/react";

const Pagination = ({ totalPages, page, onChange }) => {
  return (
    <NextUIPagination
      total={totalPages}
      initialPage={page}
      onChange={onChange}
    />
  );
};

export default Pagination;
