# Dark Knight 2021
Team Anveshak's 2021 code repository
### Running Detection
```sh
roslaunch camera.launch
roslaunch track.launch
```

For viewing video feed (using gstreamer) and marker locations
```sh
rosrun image_view image_view image:=/v4l/camera/image_raw 
rostopic echo /ar_pose_marker
```
