import React, { useState } from "react";
import cn from "classnames";

import { EditsProps } from "./Edits.props";

import styles from "./Edits.module.css";
import { BackIcon, SupheedIcon } from "assets";
import { Input } from "components";
import { colorCard } from "helpers";
import { IUser } from "interface";

export const Edits = ({
  className,
  edit,
  setEdit,
  user,
  ...props
}: EditsProps): JSX.Element => {
  const person: IUser | undefined = user?.data;
  const [username, setUsername] = useState<string>(
    person?.username ? person.username : ""
  );
  const [name, setName] = useState<string>(
    person?.username ? person?.name : ""
  );
  const [surname, setSurname] = useState<string>(
    person?.username ? person?.surname : ""
  );
  const [email, setEmail] = useState<string>(
    person?.username ? person?.email : ""
  );
  const [password, setPassword] = useState<string>("");
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [passwordReapeat, setPasswordReapeat] = useState<string>("");

  const color = colorCard(String(user?.data.name.toUpperCase().slice()[0]));

  return (
    <section
      className={cn(className, styles.editWrapper, {
        [styles.editWrapperOpen]: edit === true,
      })}
      {...props}
    >
      <div className={styles.editHead}>
        <div>
          <BackIcon className={styles.back} onClick={() => setEdit(false)} />
          <h2>Edit Profile</h2>
        </div>
      </div>
      <div className={styles.editUser}>
        <div
          className={styles.editPhoto}
          style={{
            background: `linear-gradient(${color?.color1}, ${color?.color2})`,
          }}
        >
          {user?.data.surname.toUpperCase().slice()[0]}
          {user?.data.name.toUpperCase().slice()[0]}
        </div>
        <Input placeholderName='Name' text={name} setText={setName} />
        <Input
          placeholderName='Surname(optional)'
          text={surname}
          setText={setSurname}
        />
        <Input placeholderName='Bio(optional)' />
      </div>
      <div className={styles.editInfo}>
        <p>Any details such as age, occupation or city.</p>
        <p>Example: 23 y.o. designer from San Francisco</p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Email</h2>
        <Input placeholderName='Email' text={email} setText={setEmail} />
      </div>
      <div className={styles.editInfo}>
        <p>You can change the your email on Telegram.</p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Username</h2>
        <Input
          placeholderName='Username'
          text={username}
          setText={setUsername}
        />
      </div>
      <div className={styles.editInfo}>
        <p>
          You can choose a username on Telegram. If you do people will be able
          to find you by this username.
        </p>
      </div>
      <div className={styles.editUser}>
        <h2 className={styles.usernameEdit}>Password</h2>
        <Input placeholderName='Main password' password={true} />
        <Input placeholderName='New password' password={true} />
        <Input placeholderName='Repeat password' password={true} />
      </div>
      <div className={styles.editInfo}>
        <p>You can change the your password on Telegram.</p>
      </div>
      <button className={styles.supheed}>
        <SupheedIcon />
      </button>
    </section>
  );
};
