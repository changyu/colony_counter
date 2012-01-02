<?php
if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{
	// Get the data
  $imgfold="./plate_images";
  $plog="plate_score.log";
  $imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
  $rsta=explode('&',$imageData);
  $para=$rsta[0];
  $pnote=substr($rsta[1], strpos($rsta[1], "=")+1);
  $file=substr($rsta[2], strpos($rsta[2], "=")+1);
  $winfs=substr($rsta[3], strpos($rsta[3], "=")+1);
  $filteredData=substr($rsta[4], strpos($rsta[4], ",")+1);
  $unencodedData=base64_decode($filteredData);
  
  $info = pathinfo($file);
  $file_name =  basename($file,'.'.$info['extension']);
  
  $newfile=$imgfold."/".date('Y')."/".date('M')."/".date('D')."_".date('d')."_".uniqid().".".$info['extension'];
  $dirname = dirname($newfile);
  if (!is_dir($dirname)){  mkdir($dirname, 0755, true);}
  $fp = fopen( $newfile, 'wb' ) or exit("Can't open ".$newfile);
  fwrite( $fp, $unencodedData);
  fclose( $fp ); 

  $fp2 = fopen( $imgfold."/".$plog, 'w' ) or exit("Can't open");
  fwrite( $fp2,$pname.":".$rsta[0]."\n@ ".$rsta[1]."\n@ ".$rsta[2]."\n\n" );
  fclose( $fp2 ); 

  echo  $file." is successfully saved!|".$newfile;
}
?>
