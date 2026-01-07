interface Props {
  title: string;
  description?: string;
}

const Breadcrumb = ({ description, title }: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <span className="sm:text-twoXsMedium text-lgMedium text-brand-500">
          {title}
        </span>
        <span className="sn:text-mdRegular text-xsRegular text-[#A1A1A1]">
          {description}
        </span>
      </div>
    </div>
  );
};

export default Breadcrumb;
