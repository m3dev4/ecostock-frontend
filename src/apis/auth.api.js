import instance from "@/utils/axios";

export const login = async (credential) => {
  return instance.post("token/", credential);
};

export const refreshToken = async (refresh) => {
  return instance.post("token/refresh", {
    refresh
  });
};

        