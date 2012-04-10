#include <LightSensor.h>
#include <TouchSensor.h>
#include <SonarSensor.h>
#include <Motor.h>
#include <LegoLight.h>
#include <Nxt.h>
#include <Clock.h>
#include <Lcd.h>

//system
#include "main.h"
#include "EventManager.h"


/********************
 変更を加える場所 開始
********************/

//エントリーポイントとなるクラスを指定
#define mdlEntryPoint Controller

//#define CALIBRATION_MODE

/********************
 変更を加える場所　終了
********************/


using namespace ecrobot;



extern "C"
{
#include "kernel.h"
#include "kernel_id.h"
#include "ecrobot_interface.h"

/*
  ハードウェア構成に関する部分（始まり）
*/
TouchSensor touch1(PORT_1);
TouchSensor touch2(PORT_2);
LightSensor light(PORT_3);
SonarSensor sonar(PORT_4);

Motor motorA(PORT_A);
Motor motorC(PORT_C);
LegoLight legolight(PORT_B);
Nxt nxt;
Clock clock1;
Lcd lcd;


/*
  ハードウェア構成に関する部分（終わり）
*/

/*
 action
*/
void sys_stop() {
  motorA.setPWM(0);
  motorC.setPWM(0);
}

void sys_go() {
  motorA.setPWM(50);
  motorC.setPWM(50);
}

void sys_right() {
  motorA.setPWM(50);
  motorC.setPWM(0);
}

void sys_left() {
  motorA.setPWM(0);
  motorC.setPWM(50);
}

void print(char *) {
	
}

void clock_wait(int t) {
clock1.wait(t);
}


EventManager eventManager;
/*
 event
*/
void generate_external_LightWhite() {
eventManager.sendEvent(EVENT_white);
}

void generate_external_LightBlack() {
eventManager.sendEvent(EVENT_black);
}

void generate_external_TouchPress() {
eventManager.sendEvent(EVENT_touch);
}


/*
DeclareCounter(SysTimerCnt);
DeclareTask(TaskMain);
DeclareTask(TaskEvent);
DeclareAlarm(cyclic_alarm1);
DeclareEvent(EventSleep);
DeclareEvent(EventSleepI2C);
*/

/* nxtOSEK hook to be invoked from an ISR in category 2 */
/*void user_1ms_isr_type2(void)
{
	(void)SignalCounter(SysTimerCnt); // Alarm counter
	SleeperMonitor(); // needed for I2C device and Clock classes
}
*/
void jsp_systick_low_priority(void)
{
    if (get_OS_flag()) /* check whether JSP already started or not */
    {
        isig_tim();          /* cyclic task dispatcher */
        check_NXT_buttons();
    }
}

                             
//周期ハンドラ用の関数（10msecごとに起動）
void cyc0(VP_INT exinf)
{
	iact_tsk(TSK1);//TaskEventの起動
}

                             

	
int sonacnt;


void TaskMain(VP_INT exinf)
{
  lcd.clear();
	StateMachine *stm = new t1_2();
	eventManager.addSTM(stm);

	sonacnt = 0;
	while(true)
	{
		eventManager.execute();
	}
    ext_tsk();
}

#define WHITE 580
#define GRAY 480
#define GRAY_MAX (GRAY + 8)
#define GRAY_MIN (GRAY - 8)
#define BLACK 320
#define EDGE_COLOR ((GRAY + WHITE) / 2)

#define LIGHT_STATUS_BLACK 0
#define LIGHT_STATUS_GRAY 1
#define LIGHT_STATUS_WHITE 2
int prev_light_status = LIGHT_STATUS_GRAY;

#define TOUCH_STATUS_NOT_PRESS 0
#define TOUCH_STATUS_PRESS 1
int prev_touch_status = TOUCH_STATUS_NOT_PRESS;
	
#define TOUCH_STATUS_NOT_PRESS_2 0
#define TOUCH_STATUS_PRESS_2 1
int prev_touch_status_2 = TOUCH_STATUS_NOT_PRESS_2;

#define SONAR_STATUS_SMALL_10 0
#define SONAR_STATUS_NOT_SMALL_10 1
int prev_sonar_status = SONAR_STATUS_NOT_SMALL_10;


#ifdef CALIBRATION_MODE

void TaskEvent(VP_INT exinf)
{
  lcd.clear();
  lcd.putf("s", "lig=");
	S16 n = light.getBrightness();
  lcd.putf("d", n);
	lcd.disp();
//  TerminateTask();
    ext_tsk();
}

#else


int gray_count = 0;

void TaskEvent(VP_INT exinf)
{
	S16 value = light.getBrightness();

	if(GRAY_MIN < value && value < GRAY_MAX){
		gray_count++;
		if(gray_count > 15) {
			gray_count = 0;
//			generate_external_GrayMarker(NULL);
			lcd.putf("s", "GrayMarker\n");
//			lightOn();
		}
	}

	if(value > EDGE_COLOR)
	{
		if(prev_light_status != LIGHT_STATUS_WHITE)
		{
			//generate signal
			generate_external_LightWhite();
		  lcd.putf("s", "LightWhite\n");
		}
		prev_light_status = LIGHT_STATUS_WHITE;
	}
	else if(value=EDGE_COLOR)
	{
		if(prev_light_status != LIGHT_STATUS_BLACK)
		{
			//generate signal
			generate_external_LightBlack();
		  lcd.putf("s", "LightBlack\n");
		}
		prev_light_status = LIGHT_STATUS_BLACK;
	}
	else
	{
		prev_light_status = LIGHT_STATUS_GRAY;
	}

	if(touch1.isPressed())
	{
///	  lcd.putf("s", "press");
		if(prev_touch_status != TOUCH_STATUS_PRESS)
		{
			generate_external_TouchPress();
		  lcd.putf("s", "TouchPress\n");
		}
		prev_touch_status = TOUCH_STATUS_PRESS;
	}
	else
	{
//	  lcd.putf("s", "not press");
		if(prev_touch_status != TOUCH_STATUS_NOT_PRESS)
		{
//			generate_external_TouchNotPress(NULL);
		}
		prev_touch_status = TOUCH_STATUS_NOT_PRESS;
	}

	if(touch2.isPressed())
	{
///	  lcd.putf("s", "press");
		if(prev_touch_status_2 != TOUCH_STATUS_PRESS_2)
		{
//			generate_external_TouchPress2(NULL);
			lcd.putf("s", "TouchPress2\n");
		}
		prev_touch_status_2 = TOUCH_STATUS_PRESS_2;
	}
	else
	{
//	  lcd.putf("s", "not press");
		if(prev_touch_status_2 != TOUCH_STATUS_NOT_PRESS_2)
		{
//			generate_external_TouchNotPress2(NULL);
		}
		prev_touch_status_2 = TOUCH_STATUS_NOT_PRESS_2;
	}
	
	sonacnt++;
	if(10 < sonacnt)
	{
		sonacnt = 0;
		if(sonar.getDistance() < 10)
		{
			if(prev_sonar_status != SONAR_STATUS_SMALL_10)
			{
//				generate_external_Sonar(NULL);
				lcd.putf("s", "Sonar\n");
			}
			prev_sonar_status = SONAR_STATUS_SMALL_10;
		}
		else
		{
			if(prev_sonar_status != SONAR_STATUS_NOT_SMALL_10)
			{
//				generate_external_NotSonar(NULL);
			}
			prev_sonar_status = SONAR_STATUS_NOT_SMALL_10;

		}
	}

  lcd.disp();
//		clock1.wait(100);
//	}
//	TerminateTask();
    ext_tsk();

}

#endif

}
