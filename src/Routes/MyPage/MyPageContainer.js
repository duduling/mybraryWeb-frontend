// Import Modules
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "react-apollo-hooks";

// Import My Files
import useInput from "./../../Hooks/useInput";
import MyPagePresenter from "./MyPagePresenter";
import { LOG_OUT, DELETE_ACCOUNT, ME, EDIT_USER_INFO } from "./MyPageQueries";
import { DUPLICATE_CHECK } from "../Auth/AuthQueries";

export default () => {
  // My Info Query
  const {
    loading,
    data: { me }
  } = useQuery(ME);

  const pw = useInput("");
  const rePw = useInput("");
  const username = useInput("");

  // Log Out Mutation
  const MutationLogOut = useMutation(LOG_OUT);

  const MutationDeleteAccount = useMutation(DELETE_ACCOUNT);

  // 닉네임 중복 체크
  const duplicateUsernameMutation = useMutation(DUPLICATE_CHECK, {
    variables: { action: "username", word: username.value }
  });

  // 회원 정보 수정
  const editUserInfoMutation = useMutation(EDIT_USER_INFO, {
    variables: { username: username.value, pw: pw.value }
  });

  const [actionEdit, setActionEdit] = useState(true);

  // Event
  const EditOnSubmit = async event => {
    event.preventDefault();

    // 비밀번호 정규식 체크
    if (pw.value !== "" || rePw.value !== "") {
      // 비밀번호 자릿수 체크
      if (pw.value.length < 8 || rePw.value.length > 16) {
        return toast.error("암호를 8자이상 16자 이하로 설정해주세요.");
      }

      // 정규식 조합에 맞지 않을 떄
      const check = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/;

      if (!check.test(pw.value)) {
        return toast.error("영문, 숫자, 특수문자의 조합으로 입력해주세요.");
      }

      // Password 값은 들어있지만 Re Password는 비어있을때
      if (rePw.value === "") {
        return toast.error("Re Password 값이 비어있습니다.");
      }

      // 패스워드 동일한지 체크
      if (pw.value !== rePw.value) {
        return toast.error("비밀번호가 일치하지않습니다.");
      }
    }

    // 닉네임 중복 체크
    if (username.value !== "") {
      try {
        const {
          data: { duplicateCheck }
        } = await duplicateUsernameMutation();
        if (duplicateCheck) {
          return toast.error("이미 존재하는 닉네임입니다. 🤦‍♂️");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (pw.value === "" && rePw.value === "" && username.value === "") {
      console.log("회원정보 수정 할 내용이 없습니다.");
    } else {
      try {
        await editUserInfoMutation();
        // window.location.reload();
      } catch (error) {
        toast.error("알 수 없는 오류가 발생했습니다. 다시 한번 시도해주세요.");
      }
    }
  };

  return (
    <MyPagePresenter
      loading={loading}
      me={me}
      MutationLogOut={MutationLogOut}
      MutationDeleteAccount={MutationDeleteAccount}
      actionEdit={actionEdit}
      setActionEdit={setActionEdit}
      pw={pw}
      rePw={rePw}
      username={username}
      EditOnSubmit={EditOnSubmit}
    />
  );
};
