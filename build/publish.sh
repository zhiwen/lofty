#!/bin/bash
#for publish lofty
#todo:
#1. 增加svn add逻辑
#1. 增加参数直接下达
#

path_build=`dirname $0`
path_lofty=$path_build/..
path_src=$path_lofty/src

confirm_lib_dir(){
    read -p "Is need to specify fdevlib directory?(Y/N): " is_need_input_lib
    case "$is_need_input_lib" in
        [Yy]) input_lib_dir;;
        [Nn]) path_lib=$path_lofty/fdevlibtemp && mkdir -p $path_lib;;
        *) echo "Please input Y or N" && confirm_lib_dir;;
    esac
}

input_lib_dir(){
    read -p "Please input the directory path of fdevlib: " path_lib
}

input_lib_svn_branch(){
    read -p "Please input the branch of style_fdevlib: " lib_branch
}

sw_branch(){
    cd $path_lib
    if [ -d $path_lib/.svn ]; then
        svn sw lib_branch
    else
        svn co lib_branch ./
    fi
}

copy_src(){
    for kind in $(ls $path_src)
    do
        copy_kind $kind
    done
}

copy_kind(){
    for file in $(ls $path_src/$1)
    do
        copy_file $1 $file
    done
}

copy_file(){
    file_type="js"
    [ $(echo $2|grep ".css")=="" ] && file_type="css"
    path_target=$path_lib/$file_type/lofty/$1
    mkdir -p $path_target
    cp -f $path_src/$1/$2 $path_target/$2
}

ci_branch(){
    cd $path_lib
    svn ci -m "lofty publish"    
}

clear(){
    [ -d $path_lofty/fdevlibtemp ] && rm -rf $path_lofty/fdevlibtemp
}

publish(){
    confirm_lib_dir
    input_lib_svn_branch
    sw_branch
    copy_src
    ci_branch
    clear
}

publish

exit 0
