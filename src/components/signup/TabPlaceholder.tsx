
interface TabPlaceholderProps {
  userType: string;
  message: string;
}

const TabPlaceholder = ({ userType, message }: TabPlaceholderProps) => {
  return (
    <div className="text-sm text-gray-600">
      {message}
    </div>
  );
};

export default TabPlaceholder;
