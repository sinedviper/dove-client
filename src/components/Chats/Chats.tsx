/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { ChatsProps } from "./Chats.props";
import { CardChat, CardContact, ChatsHeader } from "components";
import { IChat, IUser } from "interface";
import { addChat, getMessage, getUsersSearch } from "mutation";
import {
  checkAuthorization,
  checkAuthorizationSearch,
  colorCard,
} from "helpers";
import {
  actionAddMessages,
  actionClearMessages,
  getChat,
  getContacts,
  getUser,
} from "store";
import { useAppDispatch, useAppSelector, useDebounce } from "hooks";

import styles from "./Chats.module.css";
import { useTheme } from "context";
import { toast } from "react-toastify";

export const Chats = ({
  chats,
  searchContact,
  setContact,
  setSettings,
  className,
  ...props
}: ChatsProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeChange = useTheme();
  const { username } = useParams();

  const user: IUser | null = useAppSelector(getUser);
  const contacts: IUser[] | null = useAppSelector(getContacts);
  const chat: IChat[] | null = useAppSelector(getChat);

  const [mutationFunction] = useMutation(addChat);

  const [queryFunction] = useLazyQuery(getMessage, {
    onCompleted(data) {
      checkAuthorization({
        dispatch,
        navigate,
        data: data.getMessages,
        actionAdd: actionAddMessages,
        themeChange,
      });
    },
  });

  const [click, setClick] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const [valueAll, setValueAll] = useState<string>("");
  const [length, setLength] = useState<number>(0);

  const [querySearch, { data: dataSearch }] = useLazyQuery(getUsersSearch);

  let searchUsers: IUser[] | undefined = dataSearch
    ? checkAuthorizationSearch({
        dispatch,
        navigate,
        data: dataSearch?.searchUsers,
        themeChange,
      })
    : undefined;

  const handleFocus = async (contact: IUser) => {
    setSearchUser(false);
    dispatch(actionClearMessages());
    await mutationFunction({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(contact.id) },
      },
    });
    // eslint-disable-next-line array-callback-return
    const chatId = chat?.filter((obj) => {
      if (obj.user.id === contact.id) {
        return obj;
      }
    })[0];
    await queryFunction({
      variables: {
        message: {
          chatId: Number(chatId?.id),
          senderMessage: Number(user?.id),
        },
      },
    });
    navigate(`${contact?.username}`);
  };

  const debouncedCheck = useDebounce(() => {
    querySearch({
      variables: {
        input: { userId: Number(user?.id), username: String(valueAll) },
      },
    });
  }, 200);

  useEffect(() => {
    if (length !== valueAll.replaceAll(" ", "").length) {
      debouncedCheck();
      setLength(valueAll.replaceAll(" ", "").length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueAll]);

  return (
    <section
      className={className}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <ChatsHeader
        searchContact={searchContact}
        setSwiper={setSwiper}
        setContact={setContact}
        setSearchUser={setSearchUser}
        setSettings={setSettings}
        searchUser={searchUser}
        valueAll={valueAll}
        setValueAll={setValueAll}
      />
      <section
        className={cn(styles.searchWrapperUsers, {
          [styles.searchWrapperUsersOn]: searchUser === true,
        })}
      >
        {valueAll.replaceAll(" ", "") === "" && (
          <div
            className={cn(styles.contactListWrapper, {
              [styles.contactListWrapperOn]:
                valueAll.replaceAll(" ", "") !== "",
            })}
          >
            {contacts &&
              contacts.map((contact) => {
                const { color1, color2 } = colorCard(
                  contact.name.toUpperCase()[0]
                );
                return (
                  <div
                    key={contact.id}
                    className={cn(styles.contactWrapper, {
                      [styles.contactWrapperOn]: username === contact.username,
                      [styles.contactWrapperClick]: click === true,
                    })}
                    onClick={() => handleFocus(contact)}
                    onMouseDown={() => setClick(true)}
                    onMouseUp={() => setClick(false)}
                  >
                    <div
                      className={styles.contactPhoto}
                      style={{
                        background: `linear-gradient(${color1}, ${color2})`,
                      }}
                    >
                      <span>{contact.name.toUpperCase()[0]}</span>
                    </div>
                    <p>{contact.name}</p>
                  </div>
                );
              })}
          </div>
        )}
        {searchUsers && searchUsers.length !== 0 && (
          <div className={styles.searchWrapper}>
            <p>Global users</p>
            {searchUsers.map((obj) => (
              <CardContact
                key={obj.id}
                contact={obj}
                setContact={setSearchUser}
                setValue={setValueAll}
                search={true}
              />
            ))}
          </div>
        )}
      </section>
      <section
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
      >
        <ul>
          {chats &&
            chats.map((contact: IChat) => (
              <CardChat contact={contact} key={contact.id} />
            ))}
        </ul>
      </section>
    </section>
  );
};
