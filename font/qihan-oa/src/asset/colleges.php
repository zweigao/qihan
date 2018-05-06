<?php
/**
 * Created by PhpStorm.
 * User: fangf
 * Date: 2016/11/12
 * Time: 11:42
 */
header('Content-type:text/json;charset=UTF-8');
$url='http://n.sinaimg.cn/edu/gaokao/js/pages/index.8598330b.js?v=1';
$js = file_get_contents($url);
$js = preg_replace('/\s/','',$js);
//$regex = '/(define)/i';
$matches = array();
$regex = '/(\{collegelist:.+}}}})/';
preg_match($regex, $js, $matches);
$json[0] = preg_replace('/(\w+)/','"$1"',$matches[0]);
$regex = '/(\{majorlist:.+]}]})/';
preg_match($regex, $js, $matches);
$json[1] = preg_replace('/(\w+)/','"$1"',$matches[0]);
$content = '['.$json[0].','.$json[1].']';
file_put_contents('colleges.json',$content);
echo $content;