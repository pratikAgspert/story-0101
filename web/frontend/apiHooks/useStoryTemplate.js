import { useContext } from "react";
import { BASE_URL } from "../apiHooks/baseURL";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../components/ProductStoryBuilder/context";
import { makeRequest } from "./networkRequest";

export const useStoryTemplate = () => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `kvk/story_templates/`;

  const query = useQuery({
    queryKey: ["story-template"],
    queryFn: async () => {
      const templateList = await makeRequest(endPoint, "GET", getToken());
      return templateList;
    },
  });

  return { ...query };
};
