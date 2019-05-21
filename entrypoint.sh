#!/bin/bash

set -e

EXEC_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
YARN="$(which yarn)"

function usage {
    echo -e "Usage:
    fc  {[build]|lint|watch|yarn|shell}"
    exit 1
}

function get_bare_uid {
    DETECTED_UID=($(ls -dn ${1}))
    echo ${DETECTED_UID[2]}
}

BARE_UID=$(get_bare_uid /usr/src/openmew-renderer)

function user_yarn {
    arg="$YARN $1"
    if [[ ${BARE_UID} -ne 0 ]]; then
        su openmew -c "$arg"
    else
        $arg
    fi
}

echo "BARE UID ${BARE_UID}"
if [[ ${BARE_UID} -ne 0 ]]; then
    existing_user_name=$(getent passwd "${BARE_UID}" | cut -d: -f1)
    if [[ ! -z "${existing_user_name}" ]]; then
        userdel ${existing_user_name}
    fi
    useradd -u "${BARE_UID}" -m openmew
fi
rm -Rf "${EXEC_DIR}/dist"
mkdir -p "${EXEC_DIR}/dist"
chown -R openmew "${EXEC_DIR}/dist"

case "$1" in
    yarn)
        user_yarn "$@"
        ;;
    lint)
        user_yarn "install --production=false"
        user_yarn "lint"
        ;;
    watch)
        user_yarn "install --production=false"
        user_yarn "watch"
        ;;
    build|"")
        user_yarn "install --production=false"
        user_yarn "build"
        ;;
    shell|sh)
        shift
        echo "use \"su openmew\" to reach userspace"
        bash $@
        ;;
    *)
        usage
        ;;
esac
shift

if [[ -e "${EXEC_DIR}/.bash_history" ]]; then
    rm "${EXEC_DIR}/.bash_history"
fi

exit 0
