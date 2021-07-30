#!/usr/bin/env python3
import time
from adafruit_motorkit import MotorKit

# MAX_THROTTLE = 1
# MID_THROTTLE = 0.8
# MIN_THROTTLE = 0.6
# NO_THROTTLE = 0 # This is the minimum for my rig before the motors fail to move it

throttles = [1, .8, .6, .3, 0]
clockwise = [True, False]
forward = [True, False]


motors = MotorKit(0x70)

# The motors are are wired starting with the left front in
# couter-clockwise order.  So motor1 is the left front and motor4
# is the right front
rightMotors = [motors.motor4, motors.motor3]
leftMotors = [motors.motor1, motors.motor2]

# torqueState = TorqueState(rightMotors[0].throttle, leftMotors[0].throttle, time.time())



# Throttle = 0 (Max), 1 (Mid) or 2 (Min)
# clockwise = True|False
# So there are 2 x 3 = 6 total "rotations"
def rotate_discrete(throttle, clockwise):
    rotate(throttles[throttle], clockwise)

def rotate(throttle, clockwise):
    cw = 1 if clockwise else -1
    for leftMotor in leftMotors:
        leftMotor.throttle = cw * throttle
    for rightMotor in rightMotors:
        rightMotor.throttle =  -1 * cw * throttles[throttle]
    print(f"rotate throttle: {leftMotors[0].throttle}  clockwise: {clockwise}")
    # torqueState.updateTorque(rightMotors[0].throttle, leftMotors[0].throttle, time.time())


# forward = True|False
# So there are 2 x 3 x 3 = 18 total "moves"
# The highest speed ones involve throttleN values of 0, for MAX_THROTTLE
def move_discrete(throttle1, throttle2, forward):
    move(throttles[throttle1], throttles[throttle2], forward)

def move(throttle1, throttle2, forward):
    ff = 1 if forward else -1
    for leftMotor in leftMotors:
        leftMotor.throttle =  ff * throttle1
    for rightMotor in rightMotors:
        rightMotor.throttle = ff * throttle2

    print(f"move leftMotor: {leftMotors[0].throttle} rightMotor: {rightMotors[0].throttle} forward: {forward}")
    # torqueState.updateTorque(rightMotors[0].throttle, leftMotors[0].throttle, time.time())


# Theres only one stop (woah, deep)
def stop_moving():
    for motor in leftMotors + rightMotors:
        motor.throttle = 0
        # torqueState.updateTorque(0, 0, time.time())

TEMPO = 1

def test_movement():
    # for throttle1 in range(0, len(throttles)):
    #     for throttle2 in range(0, len(throttles)):
    #         if(throttle1 * throttle2 == 0):
    #             for forward in [True, False]:
    #                 move(throttle1, throttle2, forward)
    #                 time.sleep(TEMPO)
    #                 stop_moving()
    #                 time.sleep(TEMPO / 2)

    for throttle1 in range(0, len(throttles) - 2):
        for clockwise in [True, False]:
            rotate(throttle1, clockwise)
            time.sleep(TEMPO)
            stop_moving()
            time.sleep(TEMPO / 2)

    stop_moving()
