
import { useState } from "react";

export const usePostFormState = () => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("#viral #trend");
  const [postType, setPostType] = useState<'reel' | 'feed' | 'story'>('reel');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState("");
  
  return {
    caption,
    setCaption,
    hashtags,
    setHashtags,
    postType,
    setPostType,
    isScheduled,
    setIsScheduled,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime
  };
};
