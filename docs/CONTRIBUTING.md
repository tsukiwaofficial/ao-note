
# CONTRIBUTING

Thank you so much for having the time and effort on making Ao Note better than ever! 

To contribute to Ao Note, first is you have to provide values to the env files that are required to run it locally. Ao Note is a *monorepo* project, meaning it has multiple env files for different packages. But don't worry too much on creating so many env files since this project is still small therefore it still has minimal env files needed.


## ENV Reference

### Backend
#### Go inside the backend folder

```bash
  cd backend
```

#### Use this command to copy the templated env values and create a .env file

```base
  cp .env.example .env
```

| Name             | Value                                                      |
| :--------------- | :--------------------------------------------------------- |
| `MONGODB_URI`    | **Required**. Copy the URI of your own MongoDB instance    |
| `PORT`           | **Required**. Your chosen port number for server instance  |
| `BACKEND_URL`    | **Required**. http://localhost:<`PORT`>                    |
| `FRONTEND_URL`   | http://localhost:5173                                      |
| `ACCESS_SECRET`  | **Required**. Your chosen access secret key                |
| `REFRESH_SECRET` | **Required**. Your chosen refresh secrey key               |
| `MODE`           | `development`                                              |

### Frontend

#### Go inside the frontend folder

```bash
  cd frontend
```

#### Use this command to copy the templated env values and create a .env file

```base
  cp .env.example .env
```

| Name                | Value                                        |
| :------------------ | :------------------------------------------- |
| `VITE_BACKEND_URL`  | **Required**. Your server/backend's url (make sure this is the same in the backend).                                                     |
| `VITE_FRONTEND_URL` | http://localhost:5173                        |
| `VITE_NEKOSIA_API`  | https://api.nekosia.cat/api/v1/images/random |

## Additional Information

Don't have any idea what to contribute? you can check the [Issues](https://github.com/tsukiwaofficial/ao-note/issues) tab and find issues with a `good first issue` label. 

