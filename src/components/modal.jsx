const ModalContainer = ({ onClose, isOpen, title, subTitle, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm sm:text-base font-medium hover:text-indigo-700 transition-all duration-300 py-2 px-3 sm:px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-500"
      >
        Logout
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              {title}
            </h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
              {subTitle}
            </p>
            <div className="flex justify-end space-x-3 sm:space-x-4">
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors min-h-[40px] text-sm sm:text-base"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                // onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors min-h-[40px] text-sm sm:text-base"
                aria-label="Confirm logout"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
