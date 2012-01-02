<?php

// return array: salt and hash

echo md5_salt("what is this shit?")'
echo $hash, '<br>';
echo (microtime(1)-$time)*10000,': time in ms';

function md5_salt($string) {
    $chars = str_split("~");//\`!@#$%^&*()");//[]{}-_\/|'\";:,.+=<>?");
    $keys = array_rand($chars, 6);

    foreach($keys as $key) {
        $hash['salt'][] = $chars[$key];
    }

    $hash['salt'] = implode('', $hash['salt']);
    $hash['salt'] = md5($hash['salt']);
    $hash['string'] = md5($hash['salt'].$string.$hash['salt']);
    return $hash;
}

?>
