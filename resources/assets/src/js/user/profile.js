/* exported changeNickName, changePassword, changeEmail, deleteAccount, deleteAccount */

'use strict';

function changeNickName() {
    let name = $('#new-nickname').val();

    if (! name) {
        return swal({ type: 'error', html: trans('user.emptyNewNickName') });
    }

    swal({
        text: trans('user.changeNickName', { new_nickname: name }),
        type: 'question',
        showCancelButton: true
    }).then(() => fetch({
        type: 'POST',
        url: url('user/profile?action=nickname'),
        dataType: 'json',
        data: { new_nickname: name }
    })).then(result => {
        if (result.errno == 0) {

            $('.nickname').each(function () {
                $(this).html(name);
            });

            return swal({ type: 'success', html: result.msg });
        } else {
            return swal({ type: 'warning', html: result.msg });
        }
    }).catch(err => showAjaxError(err));
}

function changePassword() {
    let $oldPasswd = $('#password'),
        $newPasswd = $('#new-passwd'),
        $confirmPwd = $('#confirm-pwd');

    let password = $oldPasswd.val(),
        newPasswd = $newPasswd.val();

    if (password == '') {
        toastr.info(trans('user.emptyPassword'));
        $oldPasswd.focus();
    } else if (newPasswd == '') {
        toastr.info(trans('user.emptyNewPassword'));
        $newPasswd.focus();
    } else if ($confirmPwd.val() == '') {
        toastr.info(trans('auth.emptyConfirmPwd'));
        $confirmPwd.focus();
    } else if (newPasswd != $confirmPwd.val()) {
        toastr.warning(trans('auth.invalidConfirmPwd'));
        $confirmPwd.focus();
    } else {
        fetch({
            type: 'POST',
            url: url('user/profile?action=password'),
            dataType: 'json',
            data: { 'current_password': password, 'new_password': newPasswd }
        }).then(result => {
            if (result.errno == 0) {
                return swal({
                    type: 'success',
                    text: result.msg }
                ).then(() => {
                    return logout();
                }).then(result => {
                    if (result.errno == 0) {
                        window.location = url('auth/login');
                    }
                }).catch(err => showAjaxError(err));
            } else {
                return swal({ type: 'warning', text: result.msg });
            }
        }).catch(err => showAjaxError(err));
    }
}

$('#new-email').focusin(() => {
    $('#current-password').parent().show();
}).focusout(debounce(() => {
    let dom = $('#current-password');

    if (! dom.is(':focus')) {
        dom.parent().hide();
    }
}, 10));

function changeEmail() {
    var newEmail = $('#new-email').val();

    if (! newEmail) {
        return swal({ type: 'error', html: trans('user.emptyNewEmail') });
    }

    // check valid email address
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
        return swal({ type: 'warning', html: trans('auth.invalidEmail') });
    }

    swal({
        text: trans('user.changeEmail', { new_email: newEmail }),
        type: 'question',
        showCancelButton: true
    }).then(() => fetch({
        type: 'POST',
        url: url('user/profile?action=email'),
        dataType: 'json',
        data: { new_email: newEmail, password: $('#current-password').val() }
    })).then(result => {
        if (result.errno == 0) {
            return swal({
                type: 'success',
                text: result.msg
            }).then(() => {
                return logout();
            }).then(result => {
                if (result.errno == 0) {
                    window.location = url('auth/login');
                }
            }).catch(err => showAjaxError(err));
        } else {
            return swal({ type: 'warning', text: result.msg });
        }
    }).catch(err => showAjaxError(err));
}

function deleteAccount() {
    let password = $('.modal-body>#password').val();

    if (! password) {
        return swal({ type: 'warning', html: trans('user.emptyDeletePassword') });
    }

    fetch({
        type: 'POST',
        url: url('user/profile?action=delete'),
        dataType: 'json',
        data: { password: password }
    }).then(result => {
        if (result.errno == 0) {
            return swal({
                type: 'success',
                html: result.msg
            }).then(() => {
                window.location = url('auth/login');
            });
        } else {
            return swal({ type: 'warning', html: result.msg });
        }
    }).catch(err => showAjaxError(err));
}