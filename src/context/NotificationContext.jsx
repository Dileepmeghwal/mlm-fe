import { createContext, useState } from "react";


export const NotificationContext= createContext()


export const NotificationProvider =({children})=>{

const [unreadCount,setUnreadCount]=useState(0)
const [notifications,setNotifications]=useState([])
const [loading,setLoading]=useState(true)


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getRequest("/notification/get");
        const notification= data.data
        setNotifications(notification);
        const unread=notification.filter((n) => !n.read).length;
        setUnreadCount(unread)
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);
    


    return(
        <NotificationContext.Provider
        value={{ unreadCount, notifications, setNotifications, setUnreadCount,loading }}
        >{children}</NotificationContext.Provider>
    )
}